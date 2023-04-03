import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => Number)
  originalPrice: number;

  @Field(() => Int)
  availableQuantity: number;

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => ID)
  thumbnailMediaId: string;

  @Field(() => [String], { nullable: true })
  displayMediaIds?: string[];

  slugs: string;
  createById: string;
}
