import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongoSchema } from 'mongoose';
import { BaseEntity } from '../base.entity';
import { ActualRole } from './enum/actual-role.enum';
import { Locale } from './enum/locale.enum';
import { Role } from './enum/role.enum';
import { UserStatus } from './enum/user-status.enum';

@Schema({ timestamps: true, collection: 'User' })
@ObjectType()
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
  @Field(() => String)
  phoneNumber: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: Array<string>, enum: Role, default: [Role.User] })
  roles: Role[];

  @Prop({ type: String, enum: ActualRole })
  @Field(() => ActualRole)
  actualRole: ActualRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.Active })
  @Field(() => UserStatus)
  status: UserStatus;

  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID, { nullable: true })
  profileImageId?: string;

  @Prop({ type: MongoSchema.Types.ObjectId })
  @Field(() => ID, { nullable: true })
  coverImageId?: string;

  @Prop({ type: Array<MongoSchema.Types.ObjectId> })
  @Field(() => [ID], { nullable: true })
  followerIds?: string[];

  @Prop({ type: Array<MongoSchema.Types.ObjectId> })
  @Field(() => [ID], { nullable: true })
  followingIds?: string[];

  @Prop({ type: Array<String> })
  @Field(() => [String], { nullable: true })
  textSearchingHistory?: string[];

  @Prop({ type: String, enum: Locale, default: Locale.Vietnamese })
  @Field(() => Locale)
  locale: Locale;

  @Prop({ type: String })
  @Field(() => String, { nullable: true })
  address?: String;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
