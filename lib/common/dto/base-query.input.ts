import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class QueryOption {
  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;
}

export class BaseQueryInput {
  filter: any;
  option?: QueryOption;
  sortBy?: any;
}
