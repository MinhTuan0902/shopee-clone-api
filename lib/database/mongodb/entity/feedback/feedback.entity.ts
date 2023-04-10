import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { BaseEntity } from '../base.entity';
import { Media } from '../media/media.entity';

@Schema({ timestamps: true, collection: 'Feedback' })
@ObjectType()
export class Feedback extends BaseEntity {
  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID)
  productId: string;

  @Prop({ type: Number })
  @Field(() => Int)
  rateStar: number;

  @Prop({ type: String })
  @Field(() => String)
  content: string;

  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID)
  orderId: string;

  @Prop({ type: [{ type: MongoSchema.Types.Mixed }] })
  @Field(() => [Media], { nullable: true })
  descriptionMedias?: Media[];
}

export type FeedbackDocument = Feedback & Document;
export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
