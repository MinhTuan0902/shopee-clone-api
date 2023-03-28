import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ENVVariable } from '../env/env.constant';
import { ENVModule } from '../env/env.module';
import { ENVService } from '../env/env.service';
import { CustomRedisService } from './customer-redis.service';

class RedisServerError extends Error {
  constructor() {
    super();
    this.message = 'Fail to start Redis server';
    this.name = 'RedisServerError';
  }
}

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ENVModule],
      inject: [ENVService],
      useFactory: (envService: ENVService): RedisModuleOptions => {
        return {
          config: {
            host: envService.get(ENVVariable.RedisHost),
            port: +envService.get(ENVVariable.RedisPort),
            onClientCreated(client: Redis) {
              client.on('error', () => {
                throw new RedisServerError();
              });
            },
          },
        };
      },
    }),
  ],
  providers: [CustomRedisService],
  exports: [CustomRedisService],
})
export class CustomRedisModule {}
