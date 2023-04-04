import { CoreModule } from '@common/module/core/core.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ShopeeSettingModule } from './setting/setting.module';
import { GeoModule } from './geo/geo.module';

@Module({
  imports: [
    CoreModule,

    // API Modules
    AuthModule,
    ProductModule,
    OrderModule,
    CategoryModule,
    ShopeeSettingModule,
    GeoModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class AppModule {}
