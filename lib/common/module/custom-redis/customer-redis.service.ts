import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

interface IRedisSetInput {
  key: string;
  value: string;
  /**
   * Time to live in second
   */
  ttl?: number;
}

@Injectable()
export class CustomRedisService {
  private redis: Redis;
  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getClient();
  }

  async set({ key, value, ttl }: IRedisSetInput) {
    this.redis.set(key, value, 'EX', ttl);
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async del(key: string) {
    this.redis.del([key]);
  }
}
