import { Media } from '@mongodb/entity/media/media.entity';
import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ProductTypeInput {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  availableQuantity: number;

  @Field(() => ID)
  thumbnailMediaId: string;
  thumbnailMedia: Media;

  @Field(() => Number, { nullable: true })
  originalPrice?: number;

  @Field(() => Number, { nullable: true })
  salePrice?: number;
}

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
  thumbnailMedia: Media;

  @Field(() => [String], { nullable: true })
  displayMediaIds?: string[];

  @Field(() => [ProductTypeInput], { nullable: true })
  types?: ProductTypeInput[];

  slugs: string;
  createById: string;
}
