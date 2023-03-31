import { GraphQLBadRequestError } from '@common/error/graphql.error';

export class WrongPasswordError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'WRONG_PASSWORD',
      message: 'Password is wrong',
    });
    this.name = 'WrongPasswordError';
  }
}

export class WrongUsernameError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'WRONG_USERNAME',
      message: 'Username is wrong',
    });
    this.name = 'WrongUsernameError';
  }
}

export class RegisteredPhoneNumberError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'REGISTERED_PHONE_NUMBER',
      message: 'Phone number has been registered',
    });
    this.name = 'RegisteredPhoneNumberError';
  }
}

export class NotRegisteredPhoneNumberError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'NOT_REGISTERED_PHONE_NUMBER',
      message: 'Phone number has not been registered',
    });
    this.name = 'NotRegisteredPhoneNumberError';
  }
}

export class DisableUserError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'DISABLED_USER',
      message: 'User is disabled',
    });
    this.name = 'DisableUserError';
  }
}

export class MaxDeviceLoginExceedError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'MAX_LOGGED_DEVICE',
      message: 'Account is logged at many devices',
    });
    this.name = 'MaxDeviceLoginExceedError';
  }
}

export class ExpiredTokenError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'EXPIRED_TOKEN',
      message: 'Token is expired',
    });
    this.name = 'ExpiredTokenError';
  }
}
