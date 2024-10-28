import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Logger } from '@nestjs/common';

@Injectable()
export class CacheService implements OnModuleInit {
  private readonly redis: Redis;
  private readonly logger = new Logger(CacheService.name);
  private readonly DEFAULT_TTL = 300;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });
  }

  async onModuleInit() {
    try {
      await this.redis.ping();
      this.logger.log('Successfully connected to Redis');
    } catch (e) {
      this.logger.error('Failed to connect to Redis:', e);
    }
  }

  async keys(pattern: string = '*'): Promise<string[]> {
    return await this.redis.keys(pattern);
  }

  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttl, serializedValue);
    } catch (e) {
      this.logger.error(`Error setting cache key ${key}:`, e);
      throw e;
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return JSON.parse(value);
    } catch (e) {
      this.logger.error(`Error getting cache key ${key}:`, e);
      return null;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      return await this.redis.exists(key) === 1;
    } catch (e) {
      this.logger.error(`Error checking cache key ${key}:`, e);
      return false;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (e) {
      this.logger.error(`Error deleting cache key ${key}:`, e);
      throw e;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.redis.flushdb();
    } catch (e) {
      this.logger.error('Error clearing cache:', e);
      throw e;
    }
  }

  // ------------------- BLOCKS RANGE -------------------

  async setBlocksRange(startId: number, endId: number, blocks: any[]): Promise<void> {
    const key = `blocks_${startId}_${endId}`;
    await this.set(key, blocks);
  }

  async getBlocksRange(startId: number, endId: number): Promise<any[] | null> {
    const key = `blocks_${startId}_${endId}`;
    return await this.get(key);
  }

  async updateBlockInRanges(blockId: number, blockInfo: any): Promise<void> {
    try {
      const rangeKeys = await this.keys('blocks_*');
      for (const rangeKey of rangeKeys) {
        const [, start, end] = rangeKey.split('_').map(Number);
        if (blockId >= start && blockId <= end) {
          const rangeInfo = await this.get(rangeKey);
          if (rangeInfo) {
            rangeInfo[blockId - start] = blockInfo;
            await this.set(rangeKey, rangeInfo);
          }
        }
      }
    } catch (e) {
      this.logger.error(`Error updating block ${blockId} in ranges:`, e);
      throw e;
    }
  }
}
