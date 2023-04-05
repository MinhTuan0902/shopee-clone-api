import { GeoType } from '@mongodb/entity/geo/enum/geo-type.enum';
import { Geo, GeoDocument } from '@mongodb/entity/geo/geo.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddressInput } from '../dto/address.input';
import {
  DistrictNotBelongToProvinceError,
  DistrictNotFoundError,
  ProvinceNotFoundError,
  WardNotBelongToDistrictError,
  WardNotFoundError,
} from '../error/geo.error';

@Injectable()
export class AddressValidator {
  constructor(
    @InjectModel(Geo.name) private readonly geoModel: Model<GeoDocument>,
  ) {}

  async validateAddressInput(input: AddressInput): Promise<AddressInput> {
    const { provinceId, districtId, wardId, detail } = input;
    const province = await this.geoModel.findOne({
      id: provinceId,
      type: GeoType.Province,
    });
    if (!province) {
      throw new ProvinceNotFoundError();
    }

    const district = await this.geoModel.findOne({
      id: districtId,
      type: GeoType.District,
    });
    if (!district) {
      throw new DistrictNotFoundError();
    }
    if (district?.parentId !== provinceId) {
      throw new DistrictNotBelongToProvinceError(district.name, province.name);
    }

    const ward = await this.geoModel.findOne({
      id: wardId,
      type: GeoType.Ward,
    });
    if (!ward) {
      throw new WardNotFoundError();
    }
    if (ward?.parentId !== districtId) {
      throw new WardNotBelongToDistrictError(ward.name, district.name);
    }

    return {
      ...input,
      full: `${detail} - ${ward.name} - ${district.name} - ${province.name}`,
    };
  }
}
