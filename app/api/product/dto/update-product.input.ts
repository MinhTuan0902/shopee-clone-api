import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

@InputType()
export class UpdateProductInput extends PartialType(
  OmitType(CreateProductInput, ['thumbnailMediaId', 'thumbnailMedia'] as const),
) {
  @Field(() => ID)
  id: string;

  slugs?: string;
}
