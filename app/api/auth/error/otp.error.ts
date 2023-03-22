import { GraphQLBadRequestError } from '@common/error';

export class OTPHasBeenSentBeforeError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'OTP_HAS_BEEN_SENT',
      message: 'OTP has been sent before',
    });
    this.name = 'BeenSentBeforeError';
  }
}

export class WrongOTPError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'WRONG_OTP',
      message: 'OTP is wrong',
    });
    this.name = 'WrongOTPError';
  }
}
