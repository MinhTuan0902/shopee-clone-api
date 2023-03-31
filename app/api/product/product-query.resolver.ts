import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { RequireUser } from '@api/auth/decorator/require-user.decorator';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { Product } from '@mongodb/entity/product/product.entity';
import { Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';

@Resolver()
export class ProductQueryResolver {
  constructor(private readonly productService: ProductService) {}

  @RequireUser()
  @Query(() => [Product])
  async getMyProducts(@CurrentUser() { userId }: JWTData): Promise<Product[]> {
    return this.productService.findManyBasic({ createById_equal: userId });
  }

  async getSuggestedProducts() {}
}
