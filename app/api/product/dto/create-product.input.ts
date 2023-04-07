import { Category } from '@mongodb/entity/category/category.entity';
import { Media } from '@mongodb/entity/media/media.entity';
import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsOptional,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

@InputType()
export class ProductTypeInput {
  @MaxLength(256, {
    message: "name's length must be less than or equal to 256",
  })
  @Field(() => String)
  name: string;

  @Min(0, { message: 'availableQuantity must be greater than or equal to 0' })
  @Field(() => Number)
  availableQuantity: number;

  @IsMongoId({ message: 'thumbnailMediaId must be a valid MongoId' })
  @Field(() => ID)
  thumbnailMediaId: string;
  thumbnailMedia: Media;

  @IsOptional()
  @Min(0, { message: 'originalPrice must be greater than or equal to 0' })
  @Field(() => Number, { nullable: true })
  originalPrice?: number;

  @IsOptional()
  @Min(0, { message: 'salePrice must be greater than or equal to 0' })
  @Field(() => Number, { nullable: true })
  salePrice?: number;

  @Field(() => Date, { nullable: true })
  saleTo?: Date;
}

@InputType()
export class CreateProductInput {
  @MaxLength(256, {
    message: "name's length must be less than or equal to 256",
  })
  @Field(() => String)
  name: string;

  @MaxLength(2048, {
    message: "description's length must be less than or equal to 2048",
  })
  @Field(() => String)
  description: string;

  @IsOptional({ each: true })
  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Min(0, { message: 'originalPrice must be greater than or equal to 0' })
  @Field(() => Number)
  originalPrice: number;

  @IsOptional()
  @Min(0, { message: 'salePrice must be greater than or equal to 0' })
  @Field(() => Number, { nullable: true })
  salePrice?: number;

  @IsOptional()
  @Field(() => Date, { nullable: true })
  saleTo?: Date;

  @Min(0, { message: 'availableQuantity must be greater than or equal to 0' })
  @Field(() => Int)
  availableQuantity: number;

  @IsOptional()
  @IsMongoId({
    each: true,
    message: 'Each categoryIds value must be a valid MongoId',
  })
  @Field(() => [ID], { nullable: true })
  categoryIds?: string[];
  categories?: Category[];

  @IsMongoId({ message: 'thumbnailId must be a valid MongoId' })
  @Field(() => ID)
  thumbnailMediaId: string;
  thumbnailMedia: Media;

  @IsOptional()
  @IsMongoId({
    each: true,
    message: 'Each displayMediaIds value must be a valid MongoId',
  })
  @Field(() => [String], { nullable: true })
  displayMediaIds?: string[];
  displayMedias?: Media[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductTypeInput)
  @Field(() => [ProductTypeInput], { nullable: true })
  types?: ProductTypeInput[];

  @IsOptional()
  @Min(0, {
    message: 'maxSupportedShippingCost must be greater than or equal to 0',
  })
  @Field(() => Number, { nullable: true })
  maxSupportedShippingCost?: number;

  slugs: string;
  createById: string;
}
