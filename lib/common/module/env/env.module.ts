import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { transformAndValidateSync } from 'class-transformer-validator';
import { ENVService } from './env.service';
import { ValidateENV } from './validate-env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  providers: [
    ENVService,
    {
      provide: ValidateENV,
      useValue: transformAndValidateSync(ValidateENV, process.env, {
        validator: {
          enableDebugMessages: true,
          skipMissingProperties: false,
          skipNullProperties: false,
          skipUndefinedProperties: false,
        },
      }),
    },
  ],
  exports: [ENVService],
})
export class ENVModule {}
