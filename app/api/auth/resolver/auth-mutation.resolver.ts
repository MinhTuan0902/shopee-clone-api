import { CustomRedisService } from '@common/module/custom-redis/customer-redis.service';
import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '@entity/refresh-token/refresh-token.entity';
import { ShopeeSetting, ShopeeSettingDocument } from '@entity/setting';
import { User, UserDocument } from '@entity/user';
import { UserStatus } from '@entity/user/enum';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SMSSenderService } from '@worker/sms-sender/sms.sender.service';
import { generateNumberOTP } from 'lib/util/otp';
import { comparePassword } from 'lib/util/password';
import { now } from 'lib/util/time';
import { Connection, Model } from 'mongoose';
import {
  CreateLoginOTPInput,
  CreateRegisterRequest,
  LoginInput,
  LoginWithOTPInput,
  RegisterInput,
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
import { AuthService } from '../service';
import { AuthData } from '../type';

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

    const key = `otp:${phoneNumber}`;
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
      body: `Your verification code is ${otp}`,
    });

    return true;
  }

  @Mutation(() => AuthData)
  async register(@Args('input') input: RegisterInput): Promise<AuthData> {
    const { phoneNumber, otp } = input;
    const key = `otp:${phoneNumber}`;
    const otpInRedis = await this.customRedisService.get(key);
    if (!otpInRedis || otpInRedis !== otp) {
      throw new WrongOTPError();
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const newUser = await this.userModel.create({ ...input });
      const authData = await this.authService.createAuthData(newUser);
      this.refreshTokenModel.create({
        userId: newUser.id,
        ...authData.refreshToken,
      });
      this.customRedisService.del(key);

      return authData;
    } catch (error) {
    } finally {
      session.endSession();
    }
  }

  @Mutation(() => AuthData)
  async login(@Args('input') input: LoginInput): Promise<AuthData> {
    const { emailOrPhoneNumber, password } = input;
    const user = await this.userModel.findOne({
      deletedAt: null,
      $or: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }],
    });
    if (!user) {
      throw new WrongUsernameError();
    }

    if (!comparePassword(password, user.password)) {
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
        $gt: now('millisecond'),
      },
    });
    if (currentLoginDeviceCount >= shopeeSetting.maxDeviceLoginAllowed) {
      throw new MaxDeviceLoginExceedError();
    }

    const authData = await this.authService.createAuthData(user);
    this.refreshTokenModel.create({
      userId: user.id,
      ...authData.refreshToken,
    });

    return authData;
  }

  @Mutation(() => Boolean)
  async createLoginOTP(
    @Args('input') { phoneNumber }: CreateLoginOTPInput,
  ): Promise<boolean> {
    if (!(await this.userModel.findOne({ deletedAt: null, phoneNumber }))) {
      throw new NotRegisteredPhoneNumberError();
    }

    const key = `otp:${phoneNumber}`;
    const otp = generateNumberOTP();
    const otpTTL = this.envService.get(ENVVariable.OTPTimeToLive);
    this.customRedisService.set({
      key,
      value: otp,
      ttl: otpTTL,
    });
    this.smsSenderService.addSMSSenderPayloadToQueue({
      toPhoneNumber: phoneNumber,
      body: `Your verification code is ${otp}`,
    });

    return true;
  }

  @Mutation(() => AuthData)
  async loginWithOTP(
    @Args('input') input: LoginWithOTPInput,
  ): Promise<AuthData> {
    const { phoneNumber, otp } = input;
    const user = await this.userModel.findOne({ deletedAt: null, phoneNumber });
    if (!user) {
      throw new WrongUsernameError();
    }

    if (user.status === UserStatus.Disabled) {
      throw new DisableUserError();
    }

    const key = `otp:${phoneNumber}`;
    const otpInRedis = await this.customRedisService.get(key);
    if (!otpInRedis || otpInRedis !== otp) {
      throw new WrongOTPError();
    }

    const shopeeSetting = await this.shopeeSettingModel.findOne();
    const currentLoginDeviceCount = await this.refreshTokenModel.count({
      userId: user.id,
      revokedAt: null,
      expiresAt: {
        $gt: now('millisecond'),
      },
    });
    if (currentLoginDeviceCount >= shopeeSetting.maxDeviceLoginAllowed) {
      throw new MaxDeviceLoginExceedError();
    }

    const authData = await this.authService.createAuthData(user);
    this.refreshTokenModel.create({
      userId: user.id,
      ...authData.refreshToken,
    });
    this.customRedisService.del(key);

    return authData;
  }

  // TODO: QR login
}
