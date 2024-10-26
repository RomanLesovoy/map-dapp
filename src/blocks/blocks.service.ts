import { Injectable } from '@nestjs/common';
import { BlockchainService, BlockInfo } from '../blockchain/blockchain.service';
import { TransactionResponse } from 'ethers';

@Injectable()
export class BlocksService {
  constructor(private blockchainService: BlockchainService) {}

  async setBlockColor(blockId: number, color: number): Promise<TransactionResponse> {
    return await this.blockchainService.setBlockColor(blockId, color);
  }

  async setBlockPrice(blockId: number, price: string): Promise<TransactionResponse> {
    return await this.blockchainService.setBlockPrice(blockId, price);
  }

  async getBlockInfo(blockId: number): Promise<BlockInfo> {
    return await this.blockchainService.getBlockInfo(blockId);
  }

  async getAllBlocksInfo(startId: number, endId: number): Promise<BlockInfo[]> {
    return await this.blockchainService.getAllBlocksInfo(startId, endId);
  }

  async setBlockPricePrepareTransaction(blockId: number, price: string): Promise<string> {
    return this.blockchainService.setBlockPricePrepareTransaction(blockId, price);
  }

  async setBlockColorPrepareTransaction(blockId: number, color: number): Promise<string> {
    return this.blockchainService.setBlockColorPrepareTransaction(blockId, color);
  }

  async updateBlockInfoCache(blockId: number): Promise<void> {
    return this.blockchainService.updateBlockInfoCache(blockId);
  }

  async buyBlockPrepareTransaction(blockId: number): Promise<string> {
    return this.blockchainService.buyBlockPrepareTransaction(blockId);
  }

  async getTransactionLogs(txHash: string) {
    return this.blockchainService.getTransactionLogs(txHash);
  }
  
  async buyBlock(blockId: number): Promise<TransactionResponse> {
    return await this.blockchainService.buyBlock(blockId);
  }
}
