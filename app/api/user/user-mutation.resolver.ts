import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class UserMutationResolver {
  constructor() {}

  @UseGuards(JWTGuard)
  updateMyInformation() {}
}
