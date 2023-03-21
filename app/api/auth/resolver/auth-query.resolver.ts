import { User } from '@entity/user';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../decorator';
import { JWTData } from '../type';

@Resolver()
export class AuthQueryResolver {
  @Query(() => User)
  me(@CurrentUser() currentUser: JWTData): User {
    return;
  }
}
