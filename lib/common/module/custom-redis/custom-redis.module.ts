import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ENVVariable } from '../env/env.constant';
import { ENVModule } from '../env/env.module';
import { ENVService } from '../env/env.service';
import { CustomRedisService } from './customer-redis.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ENVModule],
      inject: [ENVService],
      useFactory: (envService: ENVService): RedisModuleOptions => {
        return {
          config: {
            host: envService.get(ENVVariable.RedisHost),
            port: envService.get(ENVVariable.RedisPort),
            onClientCreated(client) {
              client.on('error', () => {
                console.log('An Redis error');
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
