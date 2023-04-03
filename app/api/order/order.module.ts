import { ProductModule } from '@api/product/product.module';
import { Order, OrderSchema } from '@mongodb/entity/order/order.entity';
import {
  ShopeeSetting,
  ShopeeSettingSchema,
} from '@mongodb/entity/setting/shopee-setting.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderMutationResolver } from './order-mutation.resolver';
import { OrderService } from './order.service';
import { Product, ProductSchema } from '@mongodb/entity/product/product.entity';
import { AuthModule } from '@api/auth/auth.module';
import { OrderQueryResolver } from './order-query.resolver';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    MongooseModule.forFeature([
      { name: ShopeeSetting.name, schema: ShopeeSettingSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [
    //Services
    OrderService,

    // Resolvers
    OrderMutationResolver,
    OrderQueryResolver,
  ],
})
export class OrderModule {}
