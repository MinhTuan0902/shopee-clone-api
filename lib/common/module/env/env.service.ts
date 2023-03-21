import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVVariable } from './env.constant';

@Injectable()
export class ENVService {
  constructor(private readonly configService: ConfigService) {}

  get(envVariable: ENVVariable) {
    return this.configService.get(envVariable);
  }
}
