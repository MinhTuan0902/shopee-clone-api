import { UserLoader } from '@api/user/loader/user.loader';
import { Product } from '@mongodb/entity/product/product.entity';
import { User } from '@mongodb/entity/user/user.entity';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Loader } from 'nestjs-dataloader/dist';

@Resolver(() => Product)
export class ProductFieldResolver {
  @ResolveField(() => User, { nullable: true })
  async seller(
    @Parent() product: Product,
    @Loader(UserLoader)
    userLoader: DataLoader<Product['createById'], User>,
  ): Promise<User> {
    return userLoader.load(product?.createById);
  }
}
