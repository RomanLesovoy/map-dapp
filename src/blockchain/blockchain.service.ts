import { Injectable } from '@nestjs/common';
import { BaseContract, ethers } from 'ethers';
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

  constructor(private cacheService: CacheService) {
    this.provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_PROVIDER_URL);
    this.contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, this.provider);
  }

  async buyBlock(blockId: number, buyer: string): Promise<boolean> {
    const signer = await this.provider.getSigner(buyer);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const tx = await contractWithSigner.buyBlock(blockId);
    await tx.wait();
    this.updateBlockInfoCache(blockId);
    return true;
  }

  async setBlockPrice(blockId: number, price: string, buyer: string): Promise<boolean> {
    const signer = await this.provider.getSigner(buyer);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const tx = await contractWithSigner.setBlockPrice(blockId, ethers.parseEther(price));
    await tx.wait();
    this.updateBlockInfoCache(blockId);
    return true;
  }

  async sellBlock(blockId: number, seller: string, price: string): Promise<boolean> {
    const signer = await this.provider.getSigner(seller);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const tx = await contractWithSigner.sellBlock(blockId, ethers.parseEther(price));
    await tx.wait();
    this.updateBlockInfoCache(blockId);
    return true;
  }

  async buyFromUser(blockId: number, buyer: string): Promise<boolean> {
    const signer = await this.provider.getSigner(buyer);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const blockInfo = await this.contract.getBlockInfo(blockId);
    const tx = await contractWithSigner.buyFromUser(blockId, { value: blockInfo.price });
    await tx.wait();
    this.updateBlockInfoCache(blockId);
    return true;
  }

  async setBlockColor(blockId: number, color: number, owner: string): Promise<boolean> {
    console.log('setBlockColor', blockId, color, owner)
    const signer = await this.provider.getSigner(owner);
    console.log(signer, blockId, color, owner)
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    // console.log(contractWithSigner, 'contractWithSigner')
    const tx = await contractWithSigner.setColor(blockId, color);
    // console.log(tx, 'tx')
    await tx.wait();
    this.updateBlockInfoCache(blockId);
    return true;
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

  async buyMultipleBlocks(blockIds: number[], buyer: string): Promise<boolean> {
    const signer = await this.provider.getSigner(buyer);
    const contractWithSigner = this.contract.connect(signer) as ContractWithSigner;
    const totalCost = ethers.parseEther((0.1 * blockIds.length).toString());
    const tx = await contractWithSigner.buyMultipleBlocks(blockIds, { value: totalCost });
    await tx.wait();
    blockIds.forEach(blockId => this.updateBlockInfoCache(blockId));
    return true;
  }

  async getAllBlocksInfo(startId: number, endId: number): Promise<BlockInfo[]> {
    try {
      const cacheKey = `blocks_${startId}_${endId}`;
      let blocksInfo = this.cacheService.get(cacheKey);

      if (!blocksInfo) {
        console.log((await this.contract.getAllBlocksInfo(startId, endId)))
        blocksInfo = (await this.contract.getAllBlocksInfo(startId, endId)).map((block: BlockInfo) => ({
          id: parseBlockId(block.blockAddress),
          owner: formatAddress(block.owner),
          color: Number(block.color),
          price: formatPrice(block.price),
          priceWei: block.price.toString(),
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
}
