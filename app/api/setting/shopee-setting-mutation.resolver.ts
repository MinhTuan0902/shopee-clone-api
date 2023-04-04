import { Roles } from '@api/auth/decorator/roles.decorator';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { RolesGuard } from '@api/auth/guard/roles.guard';
import {
  ShopeeSetting,
  ShopeeSettingDocument,
} from '@mongodb/entity/setting/shopee-setting.entity';
import { Role } from '@mongodb/entity/user/enum/role.enum';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateShopeeSettingInput } from './dto/update-shopee-setting.input';

@Resolver()
export class ShopeeSettingMutationResolver {
  constructor(
    @InjectModel(ShopeeSetting.name)
    private readonly shopeeSettingModel: Model<ShopeeSettingDocument>,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async updateShopeeSetting(
    @Args('input') input: UpdateShopeeSettingInput,
  ): Promise<boolean> {
    for (const prop in input) {
      if (!input[prop]) delete input[prop];
    }
    await this.shopeeSettingModel.updateOne({}, { $set: { ...input } });

    return true;
  }
}
