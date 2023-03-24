import { BaseEntity } from '@entity/base.entity';
import { CollectionName } from '@entity/collection-name';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ActualRole, Role, UserStatus } from './enum';

@Schema({ timestamps: true, collection: CollectionName.User })
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
  @Field(() => String, { nullable: true })
  phoneNumber?: string;

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

  profileImageId?: string;
  coverImageId?: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
