import { ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../base.entity';
import { Mimetype } from './enum/mimetype.enum';

@Schema({ timestamps: true, collection: 'Media' })
@ObjectType()
export class Media extends BaseEntity {
  mimetype: Mimetype;
  originalFileName: string;
  size: number;
  description?: string;
  cloudUrl?: string;
}

export type MediaDocument = Media & Document;
export const MediaSchema = SchemaFactory.createForClass(Media);
