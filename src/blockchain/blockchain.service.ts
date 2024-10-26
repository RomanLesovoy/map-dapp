import { Injectable } from '@nestjs/common';
import { BaseContract, ethers, TransactionResponse } from 'ethers';
import * as dotenv from 'dotenv';
import { ApiProperty } from '@nestjs/swagger';
import { abi } from './abi';
import { CacheService } from '../cache/cache.service';
import { formatAddress, formatPrice, parseBlockId } from './format-data';
dotenv.config();

export class BlockInfo {
  @ApiProperty()
  blockAddress: string;

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
  private wallet: ethers.Wallet;

  constructor(private cacheService: CacheService) {
    this.initializeProvider();
  }

  async initializeProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
      const network = await this.provider.getNetwork();
      console.log('Connected to network:', network.name);
      await this.initializeContract();
    } catch (error) {
      console.error('Error initializing provider:', error);
    }
  }

  async initializeContract() {
    try {
      const contractAddress = process.env.CONTRACT_ADDRESS;
      if (!contractAddress || !ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }
      this.contract = new ethers.Contract(contractAddress, abi, this.provider);
      this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    } catch (error) {
      console.error('Error in initializeContract:', error);
      throw error;
    }
  }

  async getBlockInfo(blockId: number): Promise<BlockInfo> {
    const cacheKey = `block_${blockId}`;
    let blockInfo = this.cacheService.get(cacheKey);

    if (!blockInfo) {
      blockInfo = await this.contract.getBlockInfo(blockId);
      this.cacheService.set(cacheKey, blockInfo);
    }

    return blockInfo;
  }

  async getTransactionLogs(txHash: string) {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    return receipt.logs;
  }

  async getAllBlocksInfo(startId: number, endId: number): Promise<BlockInfo[]> {
    try {
      const cacheKey = `blocks_${startId}_${endId}`;
      /**
       * TODO
       * CACHE CHECK
       */
      let blocksInfo = this.cacheService.get(cacheKey);

      if (!blocksInfo) {
        const [owners, colors, prices] = await this.contract.getAllBlocksInfo(startId, endId);
        blocksInfo = owners.map((owner: string, index: number) => ({
          id: startId + index,
          owner: formatAddress(owner),
          color: Number(colors[index]),
          price: formatPrice(prices[index]),
          priceWei: prices[index].toString(),
        }));
      }

      this.cacheService.set(cacheKey, blocksInfo);
      return blocksInfo;
    } catch (e) {
      console.error('Error in getAllBlocksInfo:', e);
      throw e;
    }
  }

  async updateBlockInfoCache(blockId: number): Promise<void> {
    const blockInfo = await this.contract.getBlockInfo(blockId);
    const cacheKey = `block_${blockId}`;
    this.cacheService.set(cacheKey, blockInfo);
    this.updateInCacheRange(blockId, blockInfo);
  }

  updateInCacheRange(blockId: number, blockInfo: BlockInfo): void {
    const allCacheKeys = Array.from(this.cacheService.keys());
    const rangeKeys = allCacheKeys.filter(key => key.startsWith('blocks_'));
    for (const rangeKey of rangeKeys) {
      const [, start, end] = rangeKey.split('_').map(Number);
      if (blockId >= start && blockId <= end) {
        const rangeInfo = this.cacheService.get(rangeKey);
        if (rangeInfo) {
          rangeInfo[blockId - start] = blockInfo;
          this.cacheService.set(rangeKey, rangeInfo);
        }
      }
    }
  }

  clearCache(): void {
    this.cacheService.clear();
  }

  async buyBlock(blockId: number): Promise<TransactionResponse> {
    try {
      const contractWithSigner = this.contract.connect(this.wallet) as ContractWithSigner;
      const tx = await contractWithSigner.buyBlock(blockId);
      await tx.wait();
      await this.updateBlockInfoCache(blockId);
      return tx;
    } catch (error) {
      console.error('Error in buyBlock:', error);
      throw error;
    }
  }

  async setBlockColor(blockId: number, color: number): Promise<TransactionResponse> {
    try {
      const contractWithSigner = this.contract.connect(this.wallet) as ContractWithSigner;
      const tx = await contractWithSigner.setColor(blockId, color);
      await tx.wait();
      await this.updateBlockInfoCache(blockId);
      return tx;
    } catch (error) {
      console.error('Error in setBlockColor:', error);
      throw error;
    }
  }

  async setBlockPrice(blockId: number, price: string): Promise<TransactionResponse> {
    try {
      const contractWithSigner = this.contract.connect(this.wallet) as ContractWithSigner;
      const priceString = typeof price === 'number' ? Number(price).toString() : price;
      const priceWei = ethers.parseEther(priceString);
      const tx = await contractWithSigner.setBlockPrice(blockId, priceWei);
      await tx.wait();
      await this.updateBlockInfoCache(blockId);
      return tx;
    } catch (error) {
      console.error('Error in setBlockPrice:', error);
      throw error;
    }
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
