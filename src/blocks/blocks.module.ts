import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { BlockchainService } from '../blockchain/blockchain.service';
import { AuthModule } from '../auth/auth.module';
import { CacheService } from '../cache/cache.service';
@Module({
  imports: [AuthModule],
  controllers: [BlocksController],
  providers: [BlocksService, BlockchainService, CacheService],
})
export class BlocksModule {}
