import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { BaseEntity } from '../base.entity';

// TODO: SIZE and COLOR

@Schema({ timestamps: true, collection: 'Product' })
@ObjectType()
export class Product extends BaseEntity {
  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: String })
  @Field(() => String)
  description: string;

  @Prop({ type: Array<string> })
  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Prop({ type: String })
  @Field(() => String)
  slugs: string[];

  @Prop({ type: Number })
  @Field(() => Number)
  originalPrice: number;

  @Prop({ type: Number })
  @Field(() => Number, { nullable: true })
  salePrice?: number;

  @Prop({ type: Number })
  @Field(() => Int)
  availableQuantity: number;

  @Prop({ type: Number, default: 0 })
  @Field(() => Int)
  totalSold: number;

  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID)
  thumbnailMediaId: string;

  @Prop({ type: Array<MongoSchema.Types.ObjectId> })
  @Field(() => [ID], { nullable: true })
  displayMediaIds?: string[];
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
