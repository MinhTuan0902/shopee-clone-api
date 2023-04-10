import { Media } from '@mongodb/entity/media/media.entity';
import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsMongoId, IsOptional, Max, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateFeedbackInput {
  @IsMongoId({ message: 'productId must be an valid MongoId' })
  @Field(() => ID)
  productId: string;

  @IsMongoId({ message: 'orderId must be an valid MongoId' })
  @Field(() => ID)
  orderId: string;

  @Min(1)
  @Max(5)
  @Field(() => Int)
  rateStar: number;

  @MaxLength(256, {
    message: "content's length must be less than or equal to 256",
  })
  @Field(() => String)
  content: string;

  @IsOptional()
  @IsMongoId({
    each: true,
    message: 'Each descriptionMediaIds value must be a valid MongoId',
  })
  @Field(() => [ID], { nullable: true })
  descriptionMediaIds?: string[];
  descriptionMedias?: Media[];

  createByUserId: string;
}
