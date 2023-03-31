import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { ProductNotFoundError } from '@api/product/error/product.error';
import { ProductService } from '@api/product/product.service';
import { Order } from '@mongodb/entity/order/order.entity';
import {
  ShopeeSetting,
  ShopeeSettingDocument,
} from '@mongodb/entity/setting/shopee-setting.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderInput } from './dto/create-order.input';
import {
  MaxDistinctProductOnOrderError,
  ProductAvailableQuantityNotEnoughError,
} from './error/order.error';
import { OrderService } from './order.service';

@Resolver()
export class OrderMutationResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,

    @InjectModel(ShopeeSetting.name)
    private readonly shopeeSettingModel: Model<ShopeeSettingDocument>,
  ) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentUser() { userId }: JWTData,
  ): Promise<Order> {
    return;
  }
}
