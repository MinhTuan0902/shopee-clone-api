import { BaseQueryInput } from '@common/dto/base-query.input';
import { Field, InputType } from '@nestjs/graphql';
import { FilterProductInput } from './filter-product.input';

@InputType()
export class QueryProductInput extends BaseQueryInput {
  @Field(() => FilterProductInput)
  filter: FilterProductInput;
}
