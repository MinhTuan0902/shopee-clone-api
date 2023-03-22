import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class BaseEntity {
  _id: string;

  @Field(() => ID)
  id: string;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Prop({ type: Date })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  createById?: string;
}
