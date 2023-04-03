import { Locale } from '@mongodb/entity/user/enum/locale.enum';
import { HttpStatus } from '@nestjs/common';
import { I18nTranslations } from 'generated/i18n';
import { GraphQLError } from 'graphql';
import { I18nContext } from 'nestjs-i18n';

interface IErrorInput {
  messageCode: string;
  message: string;
}

export class GraphQLBadRequestError extends GraphQLError {
  protected locale: Locale;
  protected i18nContext: I18nContext<I18nTranslations>;
  constructor({ messageCode, message }: IErrorInput) {
    super(message, {
      extensions: {
        status: HttpStatus.BAD_REQUEST,
        code: 'BAD_REQUEST',
        messageCode,
      },
    });
  }
}

export class GraphQLUnauthorizedError extends GraphQLError {
  constructor() {
    super('Unauthorized', {
      extensions: {
        status: HttpStatus.UNAUTHORIZED,
        code: 'UNAUTHORIZED',
        messageCode: 'UNAUTHORIZED',
      },
    });
    this.name = 'UnauthorizedError';
  }
}

export class GraphQLForbiddenError extends GraphQLError {
  constructor() {
    super('You are not allowed to do this action', {
      extensions: {
        status: HttpStatus.FORBIDDEN,
        code: 'FORBIDDEN',
        messageCode: 'FORBIDDEN',
      },
    });
    this.name = 'ForbiddenError';
  }
}
