import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BlocksService } from './blocks.service';

@Controller()
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @GrpcMethod('BlocksService')
  async getBlockInfo(data: { blockId: number }) {
    return this.blocksService.getBlockInfo(data);
  }

  @GrpcMethod('BlocksService')
  async getBlocksInfo(data: { startId: number; endId: number }) {
    return this.blocksService.getBlocksInfo(data);
  }

  @GrpcMethod('BlocksService')
  async getTransactionLogs(data: { txHash: string }) {
    return this.blocksService.getTransactionLogs(data);
  }

  @GrpcMethod('BlocksService')
  async updateBlockCache(data: { blockId: number }) {
    return this.blocksService.updateBlockCache(data.blockId);
  }

  @GrpcMethod('BlocksService')
  async prepareTransaction(data: { action: 'buy' | 'setColor' | 'setPrice'; blockId: number; color?: number; price?: string }) {
    return this.blocksService.prepareTransaction(data);
  }
}
