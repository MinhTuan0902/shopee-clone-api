import { UserAgent } from '@common/decorator/context.decorator';
import { GraphQLBadRequestError } from '@common/error/graphql.error';
import { CustomRedisService } from '@common/module/custom-redis/custom-redis.service';
import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '@mongodb/entity/refresh-token/refresh-token.entity';
import {
  ShopeeSetting,
  ShopeeSettingDocument,
} from '@mongodb/entity/setting/shopee-setting.entity';
import { UserStatus } from '@mongodb/entity/user/enum/user-status.enum';
import { User, UserDocument } from '@mongodb/entity/user/user.entity';
import { Ip } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SendSMSService } from '@worker/send-sms/send-sms.service';
import { generateNumberOTP } from 'lib/util/otp';
import { comparePassword, encryptPassword } from 'lib/util/password';
import { Connection, Model } from 'mongoose';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import {
  CreateLoginOTPInput,
  LoginInput,
  LoginWithOTPInput,
} from './dto/login.input';
import {
  ChangePasswordInput,
  CreateResetPasswordRequestInput,
  ResetPasswordInput,
} from './dto/password.input';
import { CreateRegisterRequest, RegisterInput } from './dto/register.input';
import {
  DisableUserError,
  NotRegisteredPhoneNumberError,
  RegisteredPhoneNumberError,
  WrongPasswordError,
  WrongUsernameError,
} from './error/auth.error';
import { OTPHasBeenSentBeforeError, WrongOTPError } from './error/otp.error';
import { JWTGuard } from './guard/jwt.guard';
import { AuthData } from './type/auth-data.type';
import { JWTData } from './type/jwt-data.type';

@Resolver()
export class AuthMutationResolver {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(ShopeeSetting.name)
    private readonly shopeeSettingModel: Model<ShopeeSettingDocument>,

    private readonly customRedisService: CustomRedisService,
    private readonly sendSMSService: SendSMSService,
    private readonly envService: ENVService,
    private readonly authService: AuthService,
  ) {}

  // TODO: transform phone number to multiple country. Only support VN phone number now
  @Mutation(() => Boolean)
  async createRegisterRequest(
    @Args('input') { phoneNumber }: CreateRegisterRequest,
  ): Promise<boolean> {
    if (await this.userModel.findOne({ deletedAt: null, phoneNumber })) {
      throw new RegisteredPhoneNumberError();
    }

    const key = `otp:register:${phoneNumber}`;
    if (await this.customRedisService.get(key)) {
      throw new OTPHasBeenSentBeforeError();
    }

    const otp = generateNumberOTP();
    const otpTTL = this.envService.get(ENVVariable.OTPTimeToLive);
    this.customRedisService.set({
      key,
      value: otp,
      ttl: +otpTTL,
    });
    this.sendSMSService.addSMSSenderPayloadToQueue({
      toPhoneNumber: phoneNumber,
      body: `Your OTP to register is ${otp}`,
    });

    return true;
  }

  @Mutation(() => AuthData)
  async register(
    @Args('input') input: RegisterInput,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ): Promise<AuthData> {
    const { phoneNumber, otp, password } = input;
    const key = `otp:register:${phoneNumber}`;
    const otpInRedis = await this.customRedisService.get(key);
    if (!otpInRedis || otpInRedis !== otp) {
      throw new WrongOTPError();
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const newUser = await this.userModel.create({
        ...input,
        password: await encryptPassword(password),
      });
      const refreshToken = await this.authService.generateRefreshToken();
      const jwtPayload = await this.authService.extractJWTDataFromUser(
        newUser,
        refreshToken.token,
      );
      const accessToken = await this.authService.generateAccessToken(
        jwtPayload,
      );

      this.refreshTokenModel.create({
        userId: newUser._id,
        ipAddress: ip,
        deviceName: userAgent,
        ...refreshToken,
      });
      this.customRedisService.del(key);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new GraphQLBadRequestError({
        messageCode: 'UNCAUGHT_ERROR',
        message: error?.message,
      });
    } finally {
      session.endSession();
    }
  }

  @Mutation(() => AuthData)
  async login(
    @Args('input') input: LoginInput,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ): Promise<AuthData> {
    const { username, password } = input;
    const user = await this.userModel.findOne({
      deletedAt: null,
      $or: [
        { email: username },
        { phoneNumber: username },
        { username: username },
      ],
    });
    if (!user) {
      throw new WrongUsernameError();
    }

    if (!(await comparePassword(password, user.password))) {
      throw new WrongPasswordError();
    }

    if (user.status === UserStatus.Disabled) {
      throw new DisableUserError();
    }

    const shopeeSetting = await this.shopeeSettingModel.findOne();
    const currentLoginDeviceCount = await this.refreshTokenModel.count({
      userId: user._id,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });
    if (currentLoginDeviceCount >= shopeeSetting.maxDeviceLogin) {
      // Revoked the last refresh token
      await this.refreshTokenModel.findOneAndUpdate(
        {
          userId: user._id,
          revokedAt: null,
          expiresAt: {
            $gt: new Date(),
          },
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        },
        {
          sort: {
            createdAt: 1,
          },
        },
      );
    }

    const refreshToken = await this.authService.generateRefreshToken();
    const jwtPayload = await this.authService.extractJWTDataFromUser(
      user,
      refreshToken.token,
    );
    const accessToken = await this.authService.generateAccessToken(jwtPayload);

    this.refreshTokenModel.create({
      userId: user._id,
      ipAddress: ip,
      deviceName: userAgent,
      ...refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Boolean)
  async createLoginOTP(
    @Args('input') { phoneNumber }: CreateLoginOTPInput,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ deletedAt: null, phoneNumber });
    if (!user) {
      throw new NotRegisteredPhoneNumberError();
    }

    if (user.status === UserStatus.Disabled) {
      throw new DisableUserError();
    }

    const key = `otp:login:${phoneNumber}`;
    const otp = generateNumberOTP();
    const otpTTL = this.envService.get(ENVVariable.OTPTimeToLive);
    this.customRedisService.set({
      key,
      value: otp,
      ttl: +otpTTL,
    });
    this.sendSMSService.addSMSSenderPayloadToQueue({
      toPhoneNumber: phoneNumber,
      body: `Your OTP to login is ${otp}`,
    });

    return true;
  }

  @Mutation(() => AuthData)
  async loginWithOTP(
    @Args('input') input: LoginWithOTPInput,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ): Promise<AuthData> {
    const { phoneNumber, otp } = input;
    const user = await this.userModel.findOne({ deletedAt: null, phoneNumber });
    if (!user) {
      throw new WrongUsernameError();
    }

    if (user.status === UserStatus.Disabled) {
      throw new DisableUserError();
    }

    const key = `otp:login:${phoneNumber}`;
    const otpInRedis = await this.customRedisService.get(key);
    if (!otpInRedis || otpInRedis !== otp) {
      throw new WrongOTPError();
    }

    const shopeeSetting = await this.shopeeSettingModel.findOne();
    const currentLoginDeviceCount = await this.refreshTokenModel.count({
      userId: user._id,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });
    if (currentLoginDeviceCount >= shopeeSetting.maxDeviceLogin) {
      // Revoked the last refresh token
      await this.refreshTokenModel.findOneAndUpdate(
        {
          userId: user._id,
          revokedAt: null,
          expiresAt: {
            $gt: new Date(),
          },
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        },
        {
          sort: {
            createdAt: 1,
          },
        },
      );
    }

    const refreshToken = await this.authService.generateRefreshToken();
    const jwtPayload = await this.authService.extractJWTDataFromUser(
      user,
      refreshToken.token,
    );
    const accessToken = await this.authService.generateAccessToken(jwtPayload);

    this.refreshTokenModel.create({
      userId: user._id,
      ipAddress: ip,
      deviceName: userAgent,
      ...refreshToken,
    });
    this.customRedisService.del(key);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Boolean)
  async createResetPasswordRequest(
    @Args('input') { phoneNumber }: CreateResetPasswordRequestInput,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ deletedAt: null, phoneNumber });
    if (!user) {
      throw new NotRegisteredPhoneNumberError();
    }

    if (user.status === UserStatus.Disabled) {
      throw new DisableUserError();
    }

    const key = `otp:reset-password:${phoneNumber}`;
    if (await this.customRedisService.get(key)) {
      throw new OTPHasBeenSentBeforeError();
    }
    const otp = generateNumberOTP();
    const otpTTL = this.envService.get(ENVVariable.OTPTimeToLive);
    this.customRedisService.set({ key, value: otp, ttl: +otpTTL });
    this.sendSMSService.addSMSSenderPayloadToQueue({
      toPhoneNumber: phoneNumber,
      body: `Your OTP to reset password is ${otp}`,
    });

    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Args('input') { phoneNumber, otp, newPassword }: ResetPasswordInput,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ deletedAt: null, phoneNumber });
    if (!user) {
      throw new NotRegisteredPhoneNumberError();
    }

    if (user.status === UserStatus.Disabled) {
      throw new DisableUserError();
    }

    const key = `otp:reset-password:${phoneNumber}`;
    const otpInRedis = await this.customRedisService.get(key);
    if (!otpInRedis || otpInRedis !== otp) {
      throw new WrongOTPError();
    }
    this.customRedisService.del(key);

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          password: await encryptPassword(newPassword),
        },
      },
    );

    return true;
  }

  @UseGuards(JWTGuard)
  @Mutation(() => Boolean)
  async changePassword(
    @Args('input') { currentPassword, newPassword }: ChangePasswordInput,
    @CurrentUser() currentUser: JWTData,
  ): Promise<boolean> {
    const user = await this.userModel.findOne({ _id: currentUser.userId });
    if (!(await comparePassword(currentPassword, user.password))) {
      throw new WrongPasswordError();
    }

    await this.userModel.updateOne(
      {
        _id: currentUser.userId,
      },
      {
        $set: {
          password: await encryptPassword(newPassword),
        },
      },
    );

    return true;
  }

  @UseGuards(JWTGuard)
  @Mutation(() => Boolean)
  async logoutAllDevice(@CurrentUser() { userId, refreshToken }: JWTData) {
    await this.refreshTokenModel.updateMany(
      {
        userId,
        revokedAt: null,
        expiresAt: {
          $gt: new Date(),
        },
        token: {
          $ne: refreshToken,
        },
      },
      {
        $set: {
          revokedAt: new Date(),
        },
      },
    );

    return true;

    // TODO: QR login
  }
}
