import { AddressInput } from '@api/geo/dto/address.input';
import { Product } from '@mongodb/entity/product/product.entity';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OrderDetailInput {
  @Field(() => String)
  productId: string;
  product: Product;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => Int, { defaultValue: 1 })
  quantity = 1;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderDetailInput])
  details: OrderDetailInput[];

  @Field(() => AddressInput)
  shippingAddressInput: AddressInput;
  shippingAddress: AddressInput;

  totalCost: number;

  createById: string;
}
