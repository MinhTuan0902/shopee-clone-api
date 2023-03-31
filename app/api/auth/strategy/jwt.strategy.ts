import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import { Injectable } from '@nestjs/common/decorators';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTData } from '../type/jwt-data.type';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly envService: ENVService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.get(ENVVariable.JWTSecret),
    });
  }

  validate(payload: JWTData) {
    return payload;
  }
}
