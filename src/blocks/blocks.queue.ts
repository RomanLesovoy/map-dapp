import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class BlocksQueue {
  constructor(
    @InjectQueue('blocks') private readonly blocksQueue: Queue,
    private readonly logger: Logger,
  ) {}

  async processBlocksInfo(startId: number, endId: number) {
    const job = await this.blocksQueue.add(
      'getBlocksInfo',
      { startId, endId },
      {
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
    }
  }
}
