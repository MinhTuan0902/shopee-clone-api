import { OrderStatus } from '@mongodb/entity/order/enum/order-status.enum';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderStatusInput {
  @Field(() => ID)
  id: string;

  @Field(() => OrderStatus)
  status: OrderStatus;
}
