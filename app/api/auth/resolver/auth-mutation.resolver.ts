import { UserAgent } from '@common/decorator';
import { GraphQLBadRequestError } from '@common/error';
import { CustomRedisService } from '@common/module/custom-redis/customer-redis.service';
import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import { RefreshToken, RefreshTokenDocument } from '@entity/refresh-token';
import { ShopeeSetting, ShopeeSettingDocument } from '@entity/setting';
import { User, UserDocument } from '@entity/user';
import { UserStatus } from '@entity/user/enum';
import { Ip, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SMSSenderService } from '@worker/sms-sender/sms.sender.service';
import { generateNumberOTP } from 'lib/util/otp';
import { comparePassword, encryptPassword } from 'lib/util/password';
import { Connection, Model } from 'mongoose';
import { CurrentUser } from '../decorator';
import {
  ChangePasswordInput,
  CreateLoginOTPInput,
  CreateRegisterRequest,
  CreateResetPasswordRequestInput,
  LoginInput,
  LoginWithOTPInput,
  RegisterInput,
  ResetPasswordInput,
} from '../dto';
import {
  DisableUserError,
  MaxDeviceLoginExceedError,
  NotRegisteredPhoneNumberError,
  OTPHasBeenSentBeforeError,
  RegisteredPhoneNumberError,
  WrongOTPError,
  WrongPasswordError,
  WrongUsernameError,
} from '../error';
import { JWTGuard } from '../guard';
import { AuthService } from '../service';
import { AuthData, JWTData } from '../type';

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
    private readonly smsSenderService: SMSSenderService,
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
      ttl: otpTTL,
    });
    this.smsSenderService.addSMSSenderPayloadToQueue({
      toPhoneNumber: phoneNumber,
      body: `Your OTP to register is ${otp}`,
    });

    return true;
  }

  @Mutation(() => AuthData)
  async register(@Args('input') input: RegisterInput): Promise<AuthData> {
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
      const authData = await this.authService.createAuthData(newUser);
      this.refreshTokenModel.create({
        userId: newUser.id,
        ...authData.refreshToken,
      });
      this.customRedisService.del(key);

      return authData;
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
    const { emailOrPhoneNumberOrUsername, password } = input;
    const user = await this.userModel.findOne({
      deletedAt: null,
      $or: [
        { email: emailOrPhoneNumberOrUsername },
        { phoneNumber: emailOrPhoneNumberOrUsername },
        { username: emailOrPhoneNumberOrUsername },
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
      userId: user.id,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });
    if (currentLoginDeviceCount >= shopeeSetting.maxDeviceLoginAllowed) {
      throw new MaxDeviceLoginExceedError();
    }

    const authData = await this.authService.createAuthData(user);
    this.refreshTokenModel.create({
      userId: user.id,
      ...authData.refreshToken,
      deviceName: userAgent,
      ipAddress: ip,
    });

    return authData;
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
      ttl: otpTTL,
    });
    this.smsSenderService.addSMSSenderPayloadToQueue({
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
      userId: user.id,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    });
    if (currentLoginDeviceCount >= shopeeSetting.maxDeviceLoginAllowed) {
      throw new MaxDeviceLoginExceedError();
    }

    const authData = await this.authService.createAuthData(user);
    this.refreshTokenModel.create({
      userId: user.id,
      ...authData.refreshToken,
      deviceName: userAgent,
      ipAddress: ip,
    });
    this.customRedisService.del(key);

    return authData;
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
    this.customRedisService.set({ key, value: otp, ttl: otpTTL });
    this.smsSenderService.addSMSSenderPayloadToQueue({
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
        _id: user.id,
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
  async logoutAllDevice(@CurrentUser() { userId }: JWTData) {
    await this.refreshTokenModel.updateMany(
      {
        userId,
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
    );

    return true;
  }

  // TODO: QR login, logout all device
}
