import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import { User } from '@mongodb/entity/user/user.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { now } from '@util/time';
import { AuthData } from './type/auth-data.type';
import { JWTData } from './type/jwt-data.type';
import { JWT } from './type/jwt.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: ENVService,
  ) {}

  extractJWTDataFromUser(user: User, refreshTokenId: string): JWTData {
    return {
      userId: user.id,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      roles: user.roles,
      actualRole: user.actualRole,
      refreshTokenId,
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

  async createAuthData(user: User, refreshTokenId: string): Promise<AuthData> {
    const jwtPayload = this.extractJWTDataFromUser(user, refreshTokenId);
    const accessToken = await this.generateAccessToken(jwtPayload);
    const refreshToken = await this.generateRefreshToken(jwtPayload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
