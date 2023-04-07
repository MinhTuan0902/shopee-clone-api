import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @IsMongoId({ message: 'id must be a valid MongoId' })
  @Field(() => String)
  name: string;

  slugs: string;
}
