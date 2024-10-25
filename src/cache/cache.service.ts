import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache: Map<string, any>;
  private lastUpdate: Map<string, number>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 минут в миллисекундах

  constructor() {
    this.cache = new Map();
    this.lastUpdate = new Map();
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  set(key: string, value: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, value);
    this.lastUpdate.set(key, Date.now() + ttl);
  }

  get(key: string): any | null {
    if (this.has(key)) {
      return this.cache.get(key);
    }
    return null;
  }

  has(key: string): boolean {
    if (!this.cache.has(key)) {
      return false;
    }
    const expirationTime = this.lastUpdate.get(key);
    return expirationTime > Date.now();
  }

  delete(key: string): void {
    this.cache.delete(key);
    this.lastUpdate.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.lastUpdate.clear();
  }
}
