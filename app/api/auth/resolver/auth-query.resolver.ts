import { User, UserDocument } from '@entity/user';
import { Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentUser, RequireUser } from '../decorator';
import { JWTData } from '../type';

@Resolver()
export class AuthQueryResolver {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @RequireUser()
  @Query(() => User)
  me(@CurrentUser() { userId }: JWTData): Promise<User> {
    return this.userModel.findOne({ _id: userId });
  }
}
