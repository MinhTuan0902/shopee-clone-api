import { HttpStatus } from '@nestjs/common';
import { GraphQLError } from 'graphql';

interface IErrorInput {
  messageCode: string;
  message: string;
}

export class GraphQLBadRequestError extends GraphQLError {
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

export class GraphQLNotFoundError extends GraphQLError {
  constructor({ messageCode, message }: IErrorInput) {
    super(message, {
      extensions: {
        status: HttpStatus.NOT_FOUND,
        code: 'NOT_FOUND',
        messageCode,
      },
    });
  }
}

export class GraphQLUnexpectedError extends GraphQLBadRequestError {
  constructor() {
    super({
      messageCode: 'UNEXPECTED_ERROR',
      message: 'An unexpected error occurred',
    });
    this.name = 'GraphQLUnexpectedError';
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
