import { ProductInOrder } from '@mongodb/entity/order/order.entity';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OrderDetailInput {
  @Field(() => String)
  productId: string;
  product: ProductInOrder;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => Int, { defaultValue: 1 })
  quantity = 1;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderDetailInput])
  details: OrderDetailInput[];

  shippingAddress: string;

  createById: string;
}
