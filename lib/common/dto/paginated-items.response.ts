import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => Boolean)
  hasNextPage: boolean;
}

@ObjectType()
export class PaginatedItems {
  items: any[];

  @Field(() => Int)
  totalItems: number;

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}
