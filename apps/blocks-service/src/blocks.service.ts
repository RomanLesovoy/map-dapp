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

  async prepareTransaction(data: { action: 'buy' | 'setColor' | 'setPrice'; blockId: number; color?: number; price?: string }) {
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