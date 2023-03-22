import { User, UserDocument } from '@entity/user';
import { UseGuards } from '@nestjs/common/decorators';
import { Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentUser } from '../decorator';
import { JWTGuard } from '../guard';
import { JWTData } from '../type';

@Resolver()
export class AuthQueryResolver {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @UseGuards(JWTGuard)
  @Query(() => User)
  me(@CurrentUser() { userId }: JWTData): Promise<User> {
    return this.userModel.findOne({ _id: userId });
  }
}
