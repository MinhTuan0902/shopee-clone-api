import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import { User } from '@mongodb/entity/user/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createUUIDv4 } from '@util/id';
import { now } from '@util/time';
import { JWTType } from './enum/jwt-type.enum';
import { JWTData } from './type/jwt-data.type';
import { JWT } from './type/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: ENVService,
  ) {}

  async extractJWTDataFromUser(
    user: User,
    refreshToken: string,
  ): Promise<JWTData> {
    return {
      userId: user._id,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      roles: user.roles,
      actualRole: user.actualRole,
      refreshToken,
      locale: user.locale,
    };
  }

  async generateAccessToken(payload: JWTData): Promise<JWT> {
    const accessTokenExpirationTime = this.envService.get(
      ENVVariable.JWTAccessTokenExpirationTime,
    );
    const token = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpirationTime,
    });
    return {
      token,
      expiresAt: new Date(now('millisecond') + +accessTokenExpirationTime),
      type: JWTType.AccessToken,
    };
  }

  async generateRefreshToken(): Promise<JWT> {
    const refreshTokenExpirationTime = this.envService.get(
      ENVVariable.JWTRefreshTokenExpirationTime,
    );
    const token = createUUIDv4();

    return {
      token,
      expiresAt: new Date(now('millisecond') + +refreshTokenExpirationTime),
      type: JWTType.RefreshToken,
    };
  }
}
