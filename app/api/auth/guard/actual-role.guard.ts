import {
  GraphQLForbiddenError,
  GraphQLUnauthorizedError,
} from '@common/error/graphql.error';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ACTUAL_ROLE_KEY } from '../decorator/actual-role.decorator';

@Injectable()
export class ActualRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredActualRoles = this.reflector.getAllAndOverride<ActualRole[]>(
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
    const canDoAction = requiredActualRoles.filter(
      (role) => user?.roles === role,
    );
    if (canDoAction) return true;

    throw new GraphQLForbiddenError();
  }
}
