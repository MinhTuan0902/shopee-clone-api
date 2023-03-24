import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import { User } from '@entity/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { now, secondToMillisecond } from 'lib/util/time';
import { AuthData, JWT, JWTData } from '../type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: ENVService,
  ) {}

  extractJWTDataFromUser(user: User): JWTData {
    return {
      userId: user.id,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      roles: user.roles,
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
    };
  }

  async generateRefreshToken(payload: JWTData): Promise<JWT> {
    const refreshTokenExpirationTime = this.envService.get(
      ENVVariable.JWTRefreshTokenExpirationTime,
    );
    const token = this.jwtService.sign(payload, {
      expiresIn: refreshTokenExpirationTime,
    });
    return {
      token,
      expiresAt: new Date(now('millisecond') + +refreshTokenExpirationTime),
    };
  }

  async createAuthData(user: User): Promise<AuthData> {
    const jwtPayload = this.extractJWTDataFromUser(user);
    const accessToken = await this.generateAccessToken(jwtPayload);
    const refreshToken = await this.generateRefreshToken(jwtPayload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
