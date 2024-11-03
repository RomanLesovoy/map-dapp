import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BlockchainService } from '../blockchain/blockchain.service';
import { Logger } from '@nestjs/common';

@Processor('blocks')
export class BlocksProcessor {
  private readonly logger = new Logger(BlocksProcessor.name);

  constructor(
    private readonly blockchainService: BlockchainService,
  ) {}

  @Process('getBlocksInfo')
  async handleGetBlocksInfo(job: Job) {
    try {
      const { startId, endId } = job.data;
      const blocksInfo = await this.blockchainService.getAllBlocksInfo(startId, endId);
      return { blocks: blocksInfo };
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}`, error);
      throw error;
    }
  }
}
