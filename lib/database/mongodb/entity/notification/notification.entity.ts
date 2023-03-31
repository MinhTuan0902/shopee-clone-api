import { ObjectType } from '@nestjs/graphql';
import { Schema } from '@nestjs/mongoose';
import { BaseEntity } from '../base.entity';

@Schema({ timestamps: true })
@ObjectType()
export class Notification extends BaseEntity {}
