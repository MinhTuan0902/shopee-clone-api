import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../base.entity';
import { Mimetype } from './enum/mimetype.enum';

@Schema({ timestamps: true, collection: 'Media' })
@ObjectType()
export class Media extends BaseEntity {
  @Prop({ type: String, enum: Mimetype })
  @Field(() => Mimetype)
  mimetype: Mimetype;

  @Prop({ type: String })
  @Field(() => String)
  originalFileName: string;

  @Prop({ type: Number })
  @Field(() => Int)
  size: number;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  description?: string;

  @Prop({ type: String })
  @Field(() => String)
  cloudUrl: string;
}

export type MediaDocument = Media & Document;
export const MediaSchema = SchemaFactory.createForClass(Media);
