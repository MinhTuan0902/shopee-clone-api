import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const UserAgent = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const context = GqlExecutionContext.create(ctx).getContext();
    return context?.req?.headers['user-agent'] || '';
  },
);
