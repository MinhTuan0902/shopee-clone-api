import {
  RefreshToken,
  RefreshTokenDocument,
} from '@mongodb/entity/refresh-token/refresh-token.entity';
import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrentUser } from './decorator/current-user.decorator';
import { RequireUser } from './decorator/require-user.decorator';
import { AuthData } from './type/auth-data.type';
import { JWTData } from './type/jwt-data.type';

@Resolver()
export class AuthQueryResolver {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  @RequireUser()
  @Query(() => User)
  me(@CurrentUser() { userId }: JWTData): Promise<User> {
    return this.userModel.findOne({ _id: userId });
  }

  // TODO: refresh token
  @RequireUser()
  @Query(() => AuthData)
  async getAuthData(
    @Args('refreshToken') refreshToken: string,
    @CurrentUser() { userId }: JWTData,
  ): Promise<AuthData> {
    const refreshTokenRecord = await this.refreshTokenModel.findOne({
      token: refreshToken,
      revokedAt: null,
      userId,
    });
    if (!refreshTokenRecord) {
      // THROW ERROR
    }
    // TODO: generate auth data
    return;
  }
}
