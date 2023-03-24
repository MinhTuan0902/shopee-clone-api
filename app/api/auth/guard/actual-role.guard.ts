import { Role } from '@entity/user/enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACTUAL_ROLE_KEY } from '../decorator';

@Injectable()
export class ActualRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const actualRolesRequired = this.reflector.getAllAndOverride<Role[]>(
      ACTUAL_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!actualRolesRequired) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return actualRolesRequired.some((actualRole) =>
      user.roles?.includes(actualRole),
    );
  }
}
