import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { IsMongoId } from 'class-validator';

@InputType()
export class UpdateProductInput extends PartialType(
  OmitType(CreateProductInput, ['thumbnailMediaId', 'thumbnailMedia'] as const),
) {
  @IsMongoId({ message: 'id must be a valid MongoId' })
  @Field(() => ID)
  id: string;

  slugs?: string;
}
