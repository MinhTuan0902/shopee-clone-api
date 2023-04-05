import {
  RefreshToken,
  RefreshTokenDocument,
} from '@mongodb/entity/refresh-token/refresh-token.entity';
import { UserStatus } from '@mongodb/entity/user/enum/user-status.enum';
import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { ExpiredTokenError, InvalidAuthTokenError } from './error/auth.error';
import { JWTGuard } from './guard/jwt.guard';
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

  @UseGuards(JWTGuard)
  @Query(() => User)
  me(@CurrentUser() { userId }: JWTData): Promise<User> {
    return this.userModel.findOne({ _id: userId });
  }

  // TODO: pass {locale} to custom errors constructor for multi langs response
  @Query(() => JWT)
  async getAccessToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<JWT> {
    const refreshTokenRecord = await this.refreshTokenModel.findOne({
      token: refreshToken,
    });
    if (!refreshTokenRecord) {
      throw new InvalidAuthTokenError();
    }
    if (
      refreshTokenRecord?.revokedAt ||
      refreshTokenRecord.expiresAt <= new Date()
    ) {
      throw new ExpiredTokenError();
    }

    const user = await this.userModel.findOne({
      _id: refreshTokenRecord.userId,
      deletedAt: null,
      status: UserStatus.Active,
    });
    if (!user) {
      throw new InvalidAuthTokenError();
    }

    const jwtPayload = await this.authService.extractJWTDataFromUser(
      user,
      refreshToken,
    );
    const accessToken = await this.authService.generateAccessToken(jwtPayload);

    return accessToken;
  }
}
