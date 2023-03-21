import { BaseEntity } from '@entity/base.entity';
import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role, UserStatus } from './enum';

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ type: String })
  @Field(() => String)
  fullName: string;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  username?: string;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  email?: string;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: Array<String>, enum: Role, default: [Role.User] })
  roles: Role[];

  @Prop({ type: String, enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  // @Prop({ type: Date })
  // @Field(() => String)
  // birthday?: Date;

  // @Prop({ type: Array<String> })
  // @Field(() => [String])
  // otherNames?: string[];

  // profileImageId?: string;
  // coverImageId?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
