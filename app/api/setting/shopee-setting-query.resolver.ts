import { Roles } from '@api/auth/decorator/roles.decorator';
import { JWTGuard } from '@api/auth/guard/jwt.guard';
import { RolesGuard } from '@api/auth/guard/roles.guard';
import {
  ShopeeSetting,
  ShopeeSettingDocument,
} from '@mongodb/entity/setting/shopee-setting.entity';
import { Role } from '@mongodb/entity/user/enum/role.enum';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Resolver()
export class ShopeeSettingQueryResolver {
  constructor(
    @InjectModel(ShopeeSetting.name)
    private readonly shopeeSettingModel: Model<ShopeeSettingDocument>,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles(Role.Admin)
  @Query(() => ShopeeSetting)
  getShopeeSetting(): Promise<ShopeeSetting> {
    return this.shopeeSettingModel.findOne();
  }
}
