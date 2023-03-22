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

export class GraphQLUnauthorizedError extends GraphQLError {
  constructor() {
    super('Unauthorized request', {
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
    super('Not allowed to do this action', {
      extensions: {
        status: HttpStatus.FORBIDDEN,
        code: 'FORBIDDEN',
        messageCode: 'FORBIDDEN',
      },
    });
    this.name = 'ForbiddenError';
  }
}
