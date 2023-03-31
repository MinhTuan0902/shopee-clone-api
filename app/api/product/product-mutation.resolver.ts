import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { RequireUser } from '@api/auth/decorator/require-user.decorator';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { Product } from '@mongodb/entity/product/product.entity';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductService } from './product.service';
import { ProductInputValidator } from './validator/product-input.validator';

@Resolver()
export class ProductMutationResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly productInputValidator: ProductInputValidator,
  ) {}

  @RequireUser()
  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: CreateProductInput,
    @CurrentUser() currentUser: JWTData,
  ): Promise<Product> {
    input = await this.productInputValidator.validateCreateProductInputData(
      input,
      currentUser,
    );
    return this.productService.createOne(input);
  }

  @RequireUser()
  @Mutation(() => Boolean)
  async updateProduct(
    @Args('input') input: UpdateProductInput,
    @CurrentUser() currentUser: JWTData,
  ): Promise<boolean> {
    await this.productInputValidator.validateUpdateProductInputData(
      input,
      currentUser,
    );
    await this.productService.updateOne(input);
    return true;
  }

  async deleteProducts() {}
}
