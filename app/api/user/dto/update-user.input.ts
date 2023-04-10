import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class UpdateFavoriteCategoriesInput {
  @IsMongoId({
    each: true,
    message: 'Each categoryIds value must be a MongoId',
  })
  @Field(() => [ID])
  categoryIds: string[];
}
