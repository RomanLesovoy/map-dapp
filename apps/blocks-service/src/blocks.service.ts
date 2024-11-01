import { Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from './blockchain/blockchain.service';
import { BlocksQueue } from './queue/blocks.queue';

@Injectable()
export class BlocksService {
  private readonly logger = new Logger(BlocksService.name);

  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly blocksQueue: BlocksQueue,
  ) {}

  async getBlockInfo(data: { blockId: number }) {
    try {
      return await this.blockchainService.getBlockInfo(data.blockId);
    } catch (error) {
      this.logger.error(`Error getting block info for ${data.blockId}:`, error);
      throw error;
    }
  }

  async getBlocksInfo(data: { startId: number; endId: number }) {
    try {
      return await this.blocksQueue.processBlocksInfo(data.startId, data.endId);
    } catch (error) {
      this.logger.error(`Error getting blocks info for range ${data.startId}-${data.endId}:`, error);
      throw error;
    }
  }

  async setBlockColor(data: { blockId: number; color: number }) {
    try {
      const tx = await this.blockchainService.setBlockColor(data.blockId, data.color);
      await this.updateBlockCache(data.blockId);
      return { hash: tx.hash };
    } catch (error) {
      this.logger.error(`Error setting block color for ${data.blockId}:`, error);
      throw error;
    }
  }

  async setBlockPrice(data: { blockId: number; price: string }) {
    try {
      const tx = await this.blockchainService.setBlockPrice(data.blockId, data.price);
      await this.updateBlockCache(data.blockId);
      return { hash: tx.hash };
    } catch (error) {
      this.logger.error(`Error setting block price for ${data.blockId}:`, error);
      throw error;
    }
  }

  async buyBlock(data: { blockId: number }) {
    try {
      const tx = await this.blockchainService.buyBlock(data.blockId);
      await this.updateBlockCache(data.blockId);
      return { hash: tx.hash };
    } catch (error) {
      this.logger.error(`Error buying block ${data.blockId}:`, error);
      throw error;
    }
  }

  async getTransactionLogs(data: { txHash: string }) {
    try {
      const logs = await this.blockchainService.getTransactionLogs(data.txHash);
      return { logs };
    } catch (error) {
      this.logger.error(`Error getting transaction logs for ${data.txHash}:`, error);
      throw error;
    }
  }

  async updateBlockCache(blockId: number) {
    try {
      return await this.blockchainService.updateBlockInfoCache(blockId);
    } catch (error) {
      this.logger.error(`Error updating cache for block ${blockId}:`, error);
      throw error;
    }
  }

  async prepareTransaction(data: { action: string; blockId: number; color?: number; price?: string }) {
    try {
      let txData: string;
      switch (data.action) {
        case 'buy':
          txData = await this.blockchainService.buyBlockPrepareTransaction(data.blockId);
          break;
        case 'setColor':
          txData = await this.blockchainService.setBlockColorPrepareTransaction(data.blockId, data.color);
          break;
        case 'setPrice':
          txData = await this.blockchainService.setBlockPricePrepareTransaction(data.blockId, data.price);
          break;
        default:
          throw new Error('Invalid action');
      }
      return { data: txData };
    } catch (error) {
      this.logger.error(`Error preparing transaction for ${data.action}:`, error);
      throw error;
    }
  }
} 