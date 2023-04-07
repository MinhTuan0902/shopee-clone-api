import {
  GraphQLBadRequestError,
  GraphQLNotFoundError,
} from '@common/error/graphql.error';

export class ProvinceNotFoundError extends GraphQLNotFoundError {
  constructor() {
    super({
      messageCode: 'PROVINCE_NOT_FOUND',
      message: 'Province is not found',
    });
    this.name = 'ProvinceNotFoundError';
  }
}

export class DistrictNotFoundError extends GraphQLNotFoundError {
  constructor() {
    super({
      messageCode: 'DISTRICT_NOT_FOUND',
      message: 'District is not found',
    });
    this.name = 'DistrictNotFoundError';
  }
}

export class WardNotFoundError extends GraphQLNotFoundError {
  constructor() {
    super({
      messageCode: 'Ward_NOT_FOUND',
      message: 'Ward is not found',
    });
    this.name = 'WardNotFoundError';
  }
}

export class DistrictNotBelongToProvinceError extends GraphQLBadRequestError {
  constructor(district: string, province: string) {
    super({
      messageCode: 'DISTRICT_NOT_BELONG_TO_PROVINCE',
      message: `${district} does not belong to ${province}`,
    });
    this.name = 'DistrictNotBelongToProvinceError';
  }
}

export class WardNotBelongToDistrictError extends GraphQLBadRequestError {
  constructor(ward: string, district: string) {
    super({
      messageCode: 'WARD_NOT_BELONG_TO_DISTRICT',
      message: `${ward} does not belong to ${district}`,
    });
    this.name = 'WardNotBelongToDistrictError';
  }
}
