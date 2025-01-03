import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Logger } from '@nestjs/common';

@Processor('blocks')
export class BlocksProcessor {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly logger: Logger,
  ) {}

  @Process('getBlocksInfo')
  async handleGetBlocksInfo(job: Job) {
    try {
      const { startId, endId } = job.data;
      const result = await this.blockchainService.getAllBlocksInfo(startId, endId);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}`, error);
      throw error;
    }
  }
}
