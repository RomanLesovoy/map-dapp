import { Module, Logger } from '@nestjs/common';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { BlockchainService } from './blockchain/blockchain.service';
import { CacheService } from './cache/cache.service';
import { BlocksQueue } from './queue/blocks.queue';
import { BullModule } from '@nestjs/bull';
import { BlocksProcessor } from './queue/blocks.processor';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
      limiter: {
        max: 100,
        duration: 5000,
      },
    }),
    BullModule.registerQueue({
      name: 'blocks',
    }),
  ],
  controllers: [BlocksController],
  providers: [
    BlocksService,
    BlockchainService,
    CacheService,
    BlocksQueue,
    BlocksProcessor,
    Logger,
  ],
})
export class BlocksModule {}
