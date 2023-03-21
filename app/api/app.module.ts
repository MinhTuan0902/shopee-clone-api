import { CoreModule } from '@common/module/core/core.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CoreModule,

    // API Modules
    AuthModule,
  ],
})
export class AppModule {}
