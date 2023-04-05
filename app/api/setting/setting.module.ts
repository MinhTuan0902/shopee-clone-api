import { AuthModule } from '@api/auth/auth.module';
import {
  ShopeeSetting,
  ShopeeSettingSchema,
} from '@mongodb/entity/setting/shopee-setting.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopeeSettingMutationResolver } from './shopee-setting-mutation.resolver';
import { ShopeeSettingQueryResolver } from './shopee-setting-query.resolver';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: ShopeeSetting.name, schema: ShopeeSettingSchema },
    ]),
  ],
  providers: [
    // Resolvers
    ShopeeSettingQueryResolver,
    ShopeeSettingMutationResolver,
  ],
})
export class ShopeeSettingModule {}
