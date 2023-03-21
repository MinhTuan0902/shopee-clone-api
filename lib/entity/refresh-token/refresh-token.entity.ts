import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: String })
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
