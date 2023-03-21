import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Media {}

export type MediaDocument = Media & Document;
export const MediaSchema = SchemaFactory.createForClass(Media);
