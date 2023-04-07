import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
  @IsMongoId({ message: 'id must be a valid MongoId' })
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  slugs: string;
}
