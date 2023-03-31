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

@Module({
  imports: [
    ProductModule,
    MongooseModule.forFeature([
      { name: ShopeeSetting.name, schema: ShopeeSettingSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  providers: [
    //Services
    OrderService,

    // Resolvers
    OrderMutationResolver,
  ],
})
export class OrderModule {}
