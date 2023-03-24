import { GraphQLForbiddenError, GraphQLUnauthorizedError } from '@common/error';
import { Role } from '@entity/user/enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ACTUAL_ROLE_KEY } from '../decorator';

@Injectable()
export class ActualRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredActualRoles = this.reflector.getAllAndOverride<Role[]>(
      ACTUAL_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredActualRoles) {
      return true;
    }

    const user = GqlExecutionContext.create(context).getContext()?.req?.user;
    if (!user) {
      throw new GraphQLUnauthorizedError();
    }
    const canDoAction = requiredActualRoles.some((role) =>
      user?.roles?.includes(role),
    );
    if (canDoAction) return true;

    throw new GraphQLForbiddenError();
  }
}
