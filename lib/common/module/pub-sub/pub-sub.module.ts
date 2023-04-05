import { Global, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ENVVariable } from '../env/env.constant';
import { ENVModule } from '../env/env.module';
import { ENVService } from '../env/env.service';

@Global()
@Module({
  imports: [ENVModule],
  providers: [
    RedisPubSub,
    {
      provide: 'PUB_SUB',
      inject: [ENVService],
      useFactory: (envService: ENVService): RedisPubSub =>
        new RedisPubSub({
          connection: {
            host: envService.get(ENVVariable.RedisHost),
            port: +envService.get(ENVVariable.RedisPort),
          },
        }),
    },
  ],
  exports: [RedisPubSub],
})
export class PubSubModule {}
