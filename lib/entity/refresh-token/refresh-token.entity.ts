import { BaseEntity } from '@entity/base.entity';
import { CollectionName } from '@entity/collection-name';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema({ timestamps: true, collection: CollectionName.RefreshToken })
@ObjectType()
export class RefreshToken extends BaseEntity {
  @Prop({ type: MongoSchema.Types.ObjectId, index: true })
  userId: string;

  @Prop({ type: String })
  token: string;

  @Prop({ type: Date })
  expiresAt: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  revokedAt?: Date;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  deviceName?: string;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  ipAddress?: string;
}

export type RefreshTokenDocument = RefreshToken & Document;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
