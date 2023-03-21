import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class CustomRedisService {
  private redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getClient();
  }

  /**
   *
   * @param {object} ttl Time to live in second
   */
  async set({ key, value, ttl }) {
    this.redis.set(key, value, 'EX', ttl);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    this.redis.del([key]);
  }
}
