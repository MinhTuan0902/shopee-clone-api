import { Field, ID } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

export class BaseEntity {
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
