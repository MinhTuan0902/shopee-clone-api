import { OrderStatus } from '@mongodb/entity/order/enum/order-status.enum';
import { ProductInOrder } from '@mongodb/entity/order/order.entity';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OrderDetailInput {
  @Field(() => String)
  productId: string;

  @Field(() => Int, { defaultValue: 1 })
  quantity = 1;

  @Field(() => String, { nullable: true })
  size?: string;

  @Field(() => String, { nullable: true })
  color?: string;

  productInOrder: ProductInOrder;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderDetailInput])
  orderDetails: OrderDetailInput[];

  createById: string;
  status: OrderStatus = OrderStatus.Pending;
}
