import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class BlocksQueue {
  private readonly logger = new Logger(BlocksQueue.name);

  constructor(
    @InjectQueue('blocks') private readonly blocksQueue: Queue,
  ) {
    this.blocksQueue.setMaxListeners(25);
  }

  async onModuleInit() {
    await this.clearQueue();
    this.logger.log('Blocks queue initialized');
  }

  async processBlocksInfo(startId: number, endId: number) {
    const job = await this.blocksQueue.add(
      'getBlocksInfo',
      { startId, endId },
      {
        removeOnFail: true,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        timeout: 30000,
        removeOnComplete: true,
      }
    );

    try {
      const result = await job.finished();
      return result;
    } catch (e) {
      this.logger.error('Error in processBlocksInfo:', e);
      throw e;
    }
  }

  async clearQueue() {
    try {
      await this.blocksQueue.empty();
      this.logger.log('Queue cleared successfully');
    } catch (error) {
      this.logger.error('Error clearing queue:', error);
      throw error;
    }
  }
}
