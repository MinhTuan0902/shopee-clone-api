import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../base.entity';

@Schema({ timestamps: true, collection: 'Category' })
@ObjectType()
export class Category extends BaseEntity {
  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: String })
  @Field(() => String)
  slugs: string;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
