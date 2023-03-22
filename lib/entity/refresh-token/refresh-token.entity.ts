import { User } from '@entity/user';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongoSchema } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: MongoSchema.Types.ObjectId, ref: User.name })
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
