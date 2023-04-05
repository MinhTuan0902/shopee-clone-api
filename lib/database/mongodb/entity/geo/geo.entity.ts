import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GeoType } from './enum/geo-type.enum';

@Schema({ collection: 'Geo' })
@ObjectType()
export class Geo {
  @Prop({ type: String, enum: GeoType })
  @Field(() => GeoType)
  type: GeoType;

  @Prop({ type: Number })
  @Field(() => Int)
  level: number;

  @Prop({ type: String, index: true })
  @Field(() => String)
  id: string;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  parentId?: string;

  @Prop({ type: String })
  @Field(() => String)
  name: string;

  @Prop({ type: String })
  @Field(() => String)
  code: string;
}

export type GeoDocument = Geo & Document;
export const GeoSchema = SchemaFactory.createForClass(Geo);
