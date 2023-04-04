import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddressInput {
  @Field(() => String)
  provinceId: string;

  @Field(() => String)
  districtId: string;

  @Field(() => String)
  wardId: string;

  @Field(() => String)
  detail: string;
}
