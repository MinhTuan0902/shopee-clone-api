import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class QueryOption {
  @Field(() => Int, { defaultValue: 20 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;
}

export class BaseQueryInput {
  filter: any;
  @Field(() => QueryOption)
  option: QueryOption;
  sortBy?: any;
}
