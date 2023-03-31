import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'ShopeeSetting' })
@ObjectType()
export class ShopeeSetting {
  @Prop({ type: Number, default: 5 })
  @Field(() => Int)
  maxDeviceLoginAllowed: number;

  @Prop({ type: Number, default: 5 })
  @Field(() => Int)
  maxDistinctProductOnOrder: number;
}

export type ShopeeSettingDocument = ShopeeSetting & Document;
export const ShopeeSettingSchema = SchemaFactory.createForClass(ShopeeSetting);
