import {
  GraphQLForbiddenError,
  GraphQLUnauthorizedError,
} from '@common/error/graphql.error';
import { Role } from '@mongodb/entity/user/enum/role.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const user = GqlExecutionContext.create(context).getContext()?.req?.user;
    if (!user) {
      throw new GraphQLUnauthorizedError();
    }

    const canDoAction = requiredRoles.some((role) =>
      user?.roles?.includes(role),
    );
    if (!canDoAction) {
      throw new GraphQLForbiddenError();
    }
    return true;
  }
}
