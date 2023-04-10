import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { BaseEntity } from '../base.entity';
import { Category } from '../category/category.entity';
import { Media } from '../media/media.entity';

@ObjectType()
export class ProductType {
  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: MongoSchema.Types.Mixed })
  @Field(() => Media)
  thumbnailMedia: Media;

  @Prop({ type: Number })
  @Field(() => Int)
  availableQuantity: number;

  @Prop({ type: Number })
  @Field(() => Number)
  originalPrice: number;

  @Prop({ type: Number })
  @Field(() => Number, { nullable: true })
  salePrice?: number;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  saleTo?: Date;
}

@Schema({ timestamps: true, collection: 'Product' })
@ObjectType()
export class Product extends BaseEntity {
  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: String })
  @Field(() => String)
  description: string;

  @Prop({ type: String, index: 'text' })
  @Field(() => String, { nullable: true })
  tags?: string;

  @Prop({ type: String })
  @Field(() => String)
  slugs: string[];

  @Prop({ type: Number })
  @Field(() => Number)
  originalPrice: number;

  @Prop({ type: Number })
  @Field(() => Number, { nullable: true })
  salePrice?: number;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  saleTo?: Date;

  @Prop({ type: Number })
  @Field(() => Int)
  availableQuantity: number;

  @Prop({ type: Number, default: 0 })
  @Field(() => Int)
  totalSold: number;

  @Prop({ type: Array<MongoSchema.Types.Mixed> })
  @Field(() => [Category], { nullable: true })
  categories?: Category[];

  @Prop({ type: MongoSchema.Types.Mixed })
  @Field(() => Media)
  thumbnailMedia: Media;

  @Prop({ type: Array<MongoSchema.Types.Mixed> })
  @Field(() => [Media], { nullable: true })
  displayMedias?: string[];

  @Prop({
    type: [
      {
        name: { type: String },
        thumbnailMedia: { type: MongoSchema.Types.Mixed },
        availableQuantity: { type: Number },
        originalPrice: { type: Number },
        salePrice: { type: Number },
        saleTo: { type: Date },
      },
    ],
    _id: false,
  })
  @Field(() => [ProductType], { nullable: true })
  types?: ProductType[];

  @Prop({ type: Number })
  @Field(() => Number, { nullable: true })
  maxSupportedShippingCost?: number;

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId }] })
  @Field(() => [ID], { nullable: true })
  likeByUserIds?: string[];
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
