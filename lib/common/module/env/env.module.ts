import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { ENVService } from './env.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ENVService],
  exports: [ENVService],
})
export class ENVModule {}
