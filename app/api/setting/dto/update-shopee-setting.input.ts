import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateShopeeSettingInput {
  @Field(() => Int, { nullable: true })
  maxDeviceLogin?: number;

  @Field(() => Int, { nullable: true })
  maxDistinctProductOnOrder?: number;

  @Field(() => Int, { nullable: true })
  maxProductUploadedMediaSize?: number;

  @Field(() => Int, { nullable: true })
  maxProductUploadedDisplayMediaQuantity?: number;
}
