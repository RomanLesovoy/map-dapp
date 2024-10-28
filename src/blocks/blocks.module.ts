import { Module, Logger } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BlocksService } from './blocks.service';
import { BlocksProcessor } from './blocks.processor';
import { BlocksQueue } from './blocks.queue';
import { BlocksController } from './blocks.controller';
import { BlockchainService } from '../blockchain/blockchain.service';
import { AuthModule } from '../auth/auth.module';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [
    AuthModule,
    BullModule.forRoot({
      redis: process.env.REDIS_URL || 'redis://localhost:6379',
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
    BlocksProcessor,
    BlocksQueue,
    Logger,
  ],
})
export class BlocksModule {}
