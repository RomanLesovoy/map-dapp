import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { BlockchainService } from '../blockchain/blockchain.service';

@Module({
  controllers: [BlocksController],
  providers: [BlocksService, BlockchainService],
})
export class BlocksModule {}
