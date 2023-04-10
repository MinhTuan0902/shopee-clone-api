import { ActualRoles } from '@api/auth/decorator/actual-role.decorator';
import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { ActualRolesGuard } from '@api/auth/guard/actual-role.guard';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { ParseMongoIdPipe } from '@common/pipe/parse-mongo-id.pipe';
import { Product } from '@mongodb/entity/product/product.entity';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { createPaginatedObject } from '@util/paginated';
import { PaginatedProduct } from './dto/paginated-product.response';
import { QueryProductInput } from './dto/query-product.input';
import { ProductNotFoundError } from './error/product.error';
import { ProductService } from './product.service';

@Resolver()
export class ProductQueryResolver {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Seller)
  @Query(() => PaginatedProduct)
  async getMyProducts(
    @Args('input') input: QueryProductInput,
    @CurrentUser() { userId }: JWTData,
  ): Promise<PaginatedProduct> {
    const products = await this.productService.findManyBasic(
      {
        ...input.filter,
        deletedAt_equal: null,
        createByUserId_equal: userId,
      },
      input.option,
    );
    const totalProducts = await this.productService.countBasic(input.filter);

    return createPaginatedObject(
      products,
      totalProducts,
      input.option.limit,
      input.option.offset,
    );
  }

  @Query(() => Product)
  async getProductDetail(
    @Args('id', ParseMongoIdPipe) id: string,
  ): Promise<Product> {
    const product = await this.productService.findOneBasic({
      id_equal: id,
      deletedAt_equal: null,
    });
    if (!product) {
      throw new ProductNotFoundError();
    }

    return product;
  }

  async getSuggestedProducts() {}
}
