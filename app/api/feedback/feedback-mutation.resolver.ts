import { ActualRoles } from '@api/auth/decorator/actual-role.decorator';
import { CurrentUser } from '@api/auth/decorator/current-user.decorator';
import { ActualRolesGuard } from '@api/auth/guard/actual-role.guard';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { JWTData } from '@api/auth/type/jwt-data.type';
import { MediaNotFoundError } from '@api/media/error/media.error';
import { MediaService } from '@api/media/media.service';
import { OrderNotFoundError } from '@api/order/error/order.error';
import { OrderService } from '@api/order/order.service';
import { ProductNotFoundError } from '@api/product/error/product.error';
import { ProductService } from '@api/product/product.service';
import { Feedback } from '@mongodb/entity/feedback/feedback.entity';
import { OrderStatus } from '@mongodb/entity/order/enum/order-status.enum';
import { ActualRole } from '@mongodb/entity/user/enum/actual-role.enum';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createMongoId } from '@util/id';
import { CreateFeedbackInput } from './dto/create-feedback.input';
import { DuplicateFeedbackError } from './error/feedback.error';
import { FeedbackService } from './feedback.service';

@Resolver()
export class FeedbackMutationResolver {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly mediaService: MediaService,
  ) {}

  @UseGuards(JWTGuard, ActualRolesGuard)
  @ActualRoles(ActualRole.Customer)
  @Mutation(() => Feedback)
  async createFeedback(
    @Args('input') input: CreateFeedbackInput,
    @CurrentUser() { userId }: JWTData,
  ): Promise<Feedback> {
    const { productId, orderId, descriptionMediaIds } = input;
    const product = await this.productService.findOneBasic({
      id_equal: productId,
      deletedAt_equal: null,
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    const userObjectId = createMongoId(userId);
    const productObjectId = createMongoId(productId);
    const order = await this.orderService.findOneByPipelines([
      {
        $match: {
          status: OrderStatus.Done,
          createByUserId: userObjectId,
          details: {
            $elemMatch: {
              'product._id': productObjectId,
            },
          },
        },
      },
    ]);
    if (!order) {
      throw new OrderNotFoundError();
    }

    if (
      await this.feedbackService.findOneBasic({
        createByUserId_equal: userId,
        productId_equal: productId,
        orderId_equal: orderId,
      })
    ) {
      throw new DuplicateFeedbackError();
    }

    if (descriptionMediaIds && descriptionMediaIds.length) {
      const descriptionMedias = await this.mediaService.findManyBasic({
        id_in: descriptionMediaIds,
        createByUserId_equal: userId,
      });
      if (descriptionMedias.length !== descriptionMediaIds.length) {
        throw new MediaNotFoundError();
      }

      input.descriptionMedias = descriptionMedias;
    }

    return this.feedbackService.createOne({
      ...input,
      createByUserId: userId,
    });
  }
}
