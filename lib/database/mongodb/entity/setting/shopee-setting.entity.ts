import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'ShopeeSetting' })
@ObjectType()
export class ShopeeSetting {
  @Prop({ type: Number, default: 5 })
  @Field(() => Int)
  maxDeviceLogin: number;

  @Prop({ type: Number, default: 5 })
  @Field(() => Int)
  maxDistinctProductOnOrder: number;

  @Prop({ type: Number, default: 2 })
  @Field(() => Int, { description: 'Max product uploaded media size in MB' })
  maxProductUploadedMediaSize: number;

  @Prop({ type: Number, default: 10 })
  @Field(() => Int, {
    description: 'Max uploaded display media quantity for 1 product',
  })
  maxProductUploadedDisplayMediaQuantity: number;
}

export type ShopeeSettingDocument = ShopeeSetting & Document;
export const ShopeeSettingSchema = SchemaFactory.createForClass(ShopeeSetting);
