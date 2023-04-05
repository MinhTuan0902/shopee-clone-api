import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';
import { BaseEntity } from '../base.entity';
import { NotificationType } from './enum/notification-type.enum';
import { Locale } from '../user/enum/locale.enum';
import { NotificationSendType } from './enum/send-type.enum';
@ObjectType({
  description: "It's necessary for client's message highlight",
})
export class NotificationHighlight {
  @Prop({ type: String, enum: Locale })
  @Field(() => Locale)
  locale: Locale;

  @Prop({ type: Number })
  @Field(() => Int)
  offset: number;

  @Prop({ type: Number })
  @Field(() => Int)
  length: number;
}

@ObjectType()
export class NotificationMessage {
  @Prop({ type: String, enum: Locale })
  @Field(() => Locale)
  locale: Locale;

  @Prop({ type: String })
  @Field(() => String)
  message: string;
}

@Schema({ timestamps: true, collection: 'Notification' })
@ObjectType()
export class Notification extends BaseEntity {
  @Prop({ type: String, enum: NotificationType })
  @Field(() => NotificationType)
  type: NotificationType;

  /**
   * @description This field is necessary for single receiver notification to override previous notification
   */
  @Prop({ type: String })
  key?: string;

  @Prop({
    type: [
      {
        locale: { type: String, enum: Locale },
        message: { type: String },
      },
    ],
    _id: false,
  })
  @Field(() => [NotificationMessage])
  messages: NotificationMessage[];

  @Prop({
    type: [
      {
        locale: { type: String, enum: Locale },
        offset: { type: Number },
        length: { type: Number },
      },
    ],
    _id: false,
  })
  @Field(() => [NotificationHighlight], { nullable: true })
  highlights?: NotificationHighlight[];

  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID, { nullable: true })
  specificReceiverId?: string;

  @Prop({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  wasReadBySpecificReceiver?: boolean;

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId }] })
  @Field(() => ID, { nullable: true })
  receiverIds?: string[];

  @Prop({ type: [{ type: MongoSchema.Types.ObjectId }] })
  @Field(() => [ID], { nullable: true })
  wasReadByReceiverIds?: string[];

  /**
   * This fields is used to update custom messages
   */
  @Prop({ type: String })
  stringVariables?: string;

  @Prop({ type: String, enum: NotificationSendType })
  @Field(() => NotificationSendType)
  sendType: NotificationSendType;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
