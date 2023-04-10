import { PaginatedItems } from '@common/dto/paginated-items.response';
import { Product } from '@mongodb/entity/product/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedProduct extends PaginatedItems {
  @Field(() => [Product])
  items: Product[];
}
