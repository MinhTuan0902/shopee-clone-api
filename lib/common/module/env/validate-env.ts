import { Injectable } from '@nestjs/common';
import {
  IsEnum,
  IsNumberString,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { NodeENV } from './env.constant';

@Injectable()
export class ValidateENV {
  @IsEnum(NodeENV)
  NODE_ENV: NodeENV;

  @IsString()
  MONGO_URI_DEVELOP: string;

  @IsString()
  MONGO_URI_PRODUCTION: string;

  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsPhoneNumber()
  TWILIO_VIRTUAL_PHONE_NUMBER: string;

  @IsString()
  REDIS_HOST: string;

  @IsNumberString()
  REDIS_PORT: number;

  @IsString()
  OTP_TTL: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumberString()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: number;

  @IsNumberString()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: number;
}
