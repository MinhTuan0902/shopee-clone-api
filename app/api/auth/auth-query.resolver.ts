import {
  RefreshToken,
  RefreshTokenDocument,
} from '@mongodb/entity/refresh-token/refresh-token.entity';
import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { RequireUser } from './decorator/require-user.decorator';
import { ExpiredTokenError, InvalidAuthTokenError } from './error/auth.error';
import { JWTData } from './type/jwt-data.type';
import { JWT } from './type/jwt.type';

@Resolver()
export class AuthQueryResolver {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,

    private readonly authService: AuthService,
  ) {}

  @RequireUser()
  @Query(() => User)
  me(@CurrentUser() { userId }: JWTData): Promise<User> {
    return this.userModel.findOne({ _id: userId });
  }

  // TODO: pass {locale} to custom errors constructor for multi langs response
  @RequireUser()
  @Query(() => JWT)
  async getAccessToken(
    @Args('refreshToken') refreshToken: string,
    @CurrentUser() { userId, locale }: JWTData,
  ): Promise<JWT> {
    const refreshTokenRecord = await this.refreshTokenModel.findOne({
      token: refreshToken,
      userId,
    });
    if (!refreshTokenRecord) throw new InvalidAuthTokenError();
    if (
      refreshTokenRecord?.revokedAt ||
      refreshTokenRecord.expiresAt <= new Date()
    ) {
      throw new ExpiredTokenError();
    }

    const user = await this.userModel.findOne({ _id: userId });
    const jwtPayload = await this.authService.extractJWTDataFromUser(
      user,
      refreshToken,
    );
    const accessToken = await this.authService.generateAccessToken(jwtPayload);

    return accessToken;
  }
}
