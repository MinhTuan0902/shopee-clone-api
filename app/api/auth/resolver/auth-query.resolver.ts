import { User, UserDocument } from '@entity/user';
import { Role } from '@entity/user/enum';
import { UseGuards } from '@nestjs/common/decorators';
import { Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentUser, Roles } from '../decorator';
import { JWTGuard, RolesGuard } from '../guard';
import { JWTData } from '../type';

@Resolver()
export class AuthQueryResolver {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(Role.User)
  @Query(() => User)
  me(@CurrentUser() { userId }: JWTData): Promise<User> {
    return this.userModel.findOne({ _id: userId });
  }
}
