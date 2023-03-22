import {
  GraphQLBadRequestError,
  GraphQLUnauthorizedError,
} from '@common/error';
import { ENVService } from '@common/module/env/env.service';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { now } from 'lib/util/time';
import { ExpiredTokenError } from '../error';
import { JWTData } from '../type';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(
    private readonly envService: ENVService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authHeader = ctx?.req?.headers?.authorization;
    if (!authHeader) {
      throw new GraphQLUnauthorizedError();
    }
    ctx.req.user = this.validateAuthHeader(authHeader);

    return true;
  }

  validateAuthHeader(authHeader: string): JWTData {
    const [bearer, token] = authHeader.split(' ');
    if (!bearer || bearer.toLowerCase() !== 'bearer') {
      throw new GraphQLUnauthorizedError();
    }

    const decode = this.jwtService.decode(token);
    if (decode['exp'] * 1000 < now('millisecond')) {
      throw new ExpiredTokenError();
    }

    return decode as JWTData;
  }
}
