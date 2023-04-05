import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Address {
  @Field(() => String)
  provinceId: string;

  @Field(() => String)
  districtId: string;

  @Field(() => String)
  wardId: string;

  @Field(() => String)
  detail: string;

  @Field(() => String)
  full: string;
}
