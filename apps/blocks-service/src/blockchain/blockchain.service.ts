import { Injectable, Logger } from '@nestjs/common';
import { BaseContract, BigNumberish, ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { ApiProperty } from '@nestjs/swagger';
import { abi } from './abi';
import { CacheService } from '../cache/cache.service';
import { formatAddress, formatPrice } from './format-data';
dotenv.config();

export class BlockInfo {
  @ApiProperty()
  owner: string;

  @ApiProperty()
  color: number;

  @ApiProperty()
  price: string;
}

interface ContractWithSigner extends BaseContract {
  buyBlock: (blockId: number) => Promise<ethers.TransactionResponse>;
  sellBlock: (blockId: number, price: ethers.BigNumberish) => Promise<ethers.TransactionResponse>;
  buyFromUser: (blockId: number, options: { value: ethers.BigNumberish }) => Promise<ethers.TransactionResponse>;
  setColor: (blockId: number, color: number) => Promise<ethers.TransactionResponse>;
  getBlockInfo: (blockId: number) => Promise<BlockInfo>;
  buyMultipleBlocks: (blockIds: number[], options: { value: ethers.BigNumberish }) => Promise<ethers.TransactionResponse>;
  getAllBlocksInfo: (startId: number, endId: number) => Promise<BlockInfo[]>;
  setBlockPrice: (blockId: number, price: ethers.BigNumberish) => Promise<ethers.TransactionResponse>;
}

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: Logger,
  ) {
    this.initializeProvider();
  }

  async initializeProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
      const network = await this.provider.getNetwork();
      this.logger.log('Connected to network:', network.name);
      await this.initializeContract();
    } catch (error) {
      this.logger.error('Error initializing provider:', error);
    }
  }

  async initializeContract() {
    try {
      const contractAddress = process.env.CONTRACT_ADDRESS;
      if (!contractAddress || !ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }
      // @ts-ignore
      this.contract = new ethers.Contract(contractAddress, abi, this.provider) as unknown as ContractWithSigner;
    } catch (error) {
      this.logger.error('Error in initializeContract:', error);
      throw error;
    }
  }

  async getBlockInfo(blockId: number): Promise<BlockInfo> {
    return await this.contract.getBlockInfo(blockId);
  }

  async getTransactionLogs(txHash: string) {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    return receipt.logs;
  }

  async getAllBlocksInfo(startId: number, endId: number): Promise<BlockInfo[]> {
    try {
      const cacheKey = `blocks_${startId}_${endId}`;
      let blocksInfo = await this.cacheService.get(cacheKey);

      if (!blocksInfo) {
        const [owners, colors, prices]: [string[], BigNumberish[], BigNumberish[]] = 
          await this.contract.getAllBlocksInfo(startId, endId);
        
        blocksInfo = owners.map((owner: string, index: number) => ({
          id: startId + index,
          owner: formatAddress(owner),
          color: Number(colors[index]),
          price: formatPrice(prices[index]),
          priceWei: prices[index].toString(),
        }));

        await this.cacheService.set(cacheKey, blocksInfo);
      }

      return blocksInfo;
    } catch (e) {
      this.logger.error('Error in getAllBlocksInfo:', e);
      throw e;
    }
  }

  async updateBlockInfoCache(blockId: number): Promise<BlockInfo> {
    const blockInfo: [string, BigNumberish, BigNumberish] = await this.contract.getBlockInfo(blockId);
    const blockData = {
      id: blockId,
      owner: formatAddress(blockInfo[0]),
      color: Number(blockInfo[1]),
      price: formatPrice(blockInfo[2]),
      priceWei: blockInfo[2].toString(),
    };
    
    await this.cacheService.set(`block_${blockId}`, blockData);
    await this.cacheService.updateBlockInRanges(blockId, blockData);
    
    return blockData;
  }

  async buyBlockPrepareTransaction(blockId: number): Promise<string> {
    return this.contract.interface.encodeFunctionData('buyBlock', [blockId]);
  }

  async setBlockPricePrepareTransaction(blockId: number, price: string): Promise<string> {
    const priceWei = ethers.parseEther(typeof price === 'number' ? Number(price).toString() : price);
    return this.contract.interface.encodeFunctionData('setBlockPrice', [blockId, priceWei]);
  }

  async setBlockColorPrepareTransaction(blockId: number, color: number): Promise<string> {
    return this.contract.interface.encodeFunctionData('setColor', [blockId, color]);
  }
}
