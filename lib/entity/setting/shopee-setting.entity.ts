import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class ShopeeSetting {
  @Prop({ type: Number, default: 3 })
  @Field(() => Int)
  maxDeviceLoginAllowed: number;
}

export type ShopeeSettingDocument = ShopeeSetting & Document;
export const ShopeeSettingSchema = SchemaFactory.createForClass(ShopeeSetting);
