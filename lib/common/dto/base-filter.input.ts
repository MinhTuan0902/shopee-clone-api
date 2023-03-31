import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class BaseFilterInput {
  @Field(() => ID, { nullable: true })
  id_equal?: string;

  @Field(() => ID, { nullable: true })
  id_notEqual?: string;

  @Field(() => [ID], { nullable: true })
  id_in?: string[];

  @Field(() => [ID], { nullable: true })
  id_notIn?: string[];

  @Field(() => Date, { nullable: true })
  createdAt_equal?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_notEqual?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_greaterThan?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_greaterThanOrEqual?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_lessThan?: Date;

  @Field(() => Date, { nullable: true })
  createdAt_lessThanOrEqual?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_equal?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_notEqual?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_greaterThan?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_greaterThanOrEqual?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_lessThan?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt_lessThanOrEqual?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_equal?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_notEqual?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_greaterThan?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_greaterThanOrEqual?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_lessThan?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt_lessThanOrEqual?: Date;
}
