import { CollectionName } from '@entity/collection-name';
import { User } from '@entity/user';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema({ timestamps: true, collection: CollectionName.RefreshToken })
export class RefreshToken {
  @Prop({ type: MongoSchema.Types.ObjectId, index: true })
  userId: string;

  @Prop({ type: String })
  token: string;

  @Prop({ type: Date })
  expiresAt: Date;

  @Prop({ type: Date })
  revokedAt: Date;
}

export type RefreshTokenDocument = RefreshToken & Document;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
