import { PaginatedProduct } from '@api/product/dto/paginated-product.response';
import { QueryOption } from '@common/dto/base-query.input';
import { Product } from '@mongodb/entity/product/product.entity';
import { User } from '@mongodb/entity/user/user.entity';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { createPaginatedObject } from '@util/paginated';

@Resolver(() => User)
export class UserFieldResolver {
  @ResolveField(() => PaginatedProduct)
  async favoriteProducts(
    @Parent() user: User,
    @Args('option') { limit, offset }: QueryOption,
  ) {
    return createPaginatedObject(
      user?.favoriteProducts || [],
      user?.favoriteProducts?.length || 0,
      limit,
      offset,
    );
  }
}
