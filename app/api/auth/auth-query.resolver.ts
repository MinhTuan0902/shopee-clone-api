import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentUser } from './decorator/current-user.decorator';
import { RequireUser } from './decorator/require-user.decorator';
import { JWTData } from './type/jwt-data.type';

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
