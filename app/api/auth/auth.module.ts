import { UserModule } from '@api/user/user.module';
import { CustomRedisModule } from '@common/module/custom-redis/custom-redis.module';
import { ENVVariable } from '@common/module/env/env.constant';
import { ENVModule } from '@common/module/env/env.module';
import { ENVService } from '@common/module/env/env.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '@mongodb/entity/refresh-token/refresh-token.entity';
import {
  ShopeeSetting,
  ShopeeSettingSchema,
} from '@mongodb/entity/setting/shopee-setting.entity';
import { User, UserSchema } from '@mongodb/entity/user/user.entity';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SendSMSModule } from '@worker/send-sms/send-sms.module';
import { AuthMutationResolver } from './auth-mutation.resolver';
import { AuthQueryResolver } from './auth-query.resolver';
import { AuthService } from './auth.service';
import { ActualRolesGuard } from './guard/actual-role.guard';
import { JWTGuard } from './guard/jwt.guard';
import { RolesGuard } from './guard/roles.guard';
import { JWTStrategy } from './strategy/jwt.strategy';
import { CategoryModule } from '@api/category/category.module';

@Module({
  imports: [
    ENVModule,
    CustomRedisModule,
    SendSMSModule,
    CategoryModule,

    forwardRef(() => UserModule),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
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
    RolesGuard,
    ActualRolesGuard,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
