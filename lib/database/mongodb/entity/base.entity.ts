import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@ObjectType()
export class BaseEntity {
  @Field(() => ID)
  _id: string;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Prop({ type: Schema.Types.ObjectId })
  @Field(() => ID, { nullable: true })
  createByUserId?: string;

  @Prop({ type: Schema.Types.ObjectId })
  @Field(() => ID, { nullable: true })
  updateByUserId?: string;

  @Prop({ type: Schema.Types.ObjectId })
  @Field(() => ID, { nullable: true })
  deleteByUserId?: string;
}
