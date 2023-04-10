import { AuthModule } from '@api/auth/auth.module';
import { GeoModule } from '@api/geo/geo.module';
import { NotificationModule } from '@api/notification/notification.module';
import { ProductModule } from '@api/product/product.module';
import { Order, OrderSchema } from '@mongodb/entity/order/order.entity';
import { Product, ProductSchema } from '@mongodb/entity/product/product.entity';
import {
  ShopeeSetting,
  ShopeeSettingSchema,
} from '@mongodb/entity/setting/shopee-setting.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderMutationResolver } from './order-mutation.resolver';
import { OrderQueryResolver } from './order-query.resolver';
import { OrderSubscriptionResolver } from './order-subscription.resolver';
import { OrderService } from './order.service';
import { PubSubModule } from '@common/module/pub-sub/pub-sub.module';
import {
  Notification,
  NotificationSchema,
} from '@mongodb/entity/notification/notification.entity';
import { OrderWorkerModule } from '@worker/order/order-worker.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    GeoModule,
    NotificationModule,
    PubSubModule,
    OrderWorkerModule,

    MongooseModule.forFeature([
      { name: ShopeeSetting.name, schema: ShopeeSettingSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [
    //Services
    OrderService,

    // Resolvers
    OrderMutationResolver,
    OrderQueryResolver,
    OrderSubscriptionResolver,
  ],
  exports: [OrderService],
})
export class OrderModule {}
