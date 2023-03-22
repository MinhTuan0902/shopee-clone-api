import { CustomRedisModule } from '@common/module/custom-redis/custom-redis.module';
import { ENVVariable } from '@common/module/env/env.constant';
import { ENVModule } from '@common/module/env/env.module';
import { ENVService } from '@common/module/env/env.service';
import { RefreshToken, RefreshTokenSchema } from '@entity/refresh-token';
import { ShopeeSetting, ShopeeSettingSchema } from '@entity/setting';
import { User, UserSchema } from '@entity/user';
import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SMSSenderModule } from '@worker/sms-sender/sms-sender.module';
import { JWTGuard } from './guard';
import { AuthMutationResolver, AuthQueryResolver } from './resolver';
import { AuthService } from './service';
import { JWTStrategy } from './strategy';

@Module({
  imports: [
    ENVModule,
    CustomRedisModule,
    SMSSenderModule,

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    MongooseModule.forFeature([
      { name: ShopeeSetting.name, schema: ShopeeSettingSchema },
    ]),

    JwtModule.registerAsync({
      imports: [ENVModule],
      inject: [ENVService],
      useFactory: (envService: ENVService): JwtModuleOptions => {
        return {
          secret: envService.get(ENVVariable.JWTSecret),
        };
      },
    }),
  ],
  providers: [
    // Resolvers
    AuthMutationResolver,
    AuthQueryResolver,

    // Services
    AuthService,

    // Strategies
    JWTStrategy,

    // Guards
    JWTGuard,
  ],
})
export class AuthModule {}
