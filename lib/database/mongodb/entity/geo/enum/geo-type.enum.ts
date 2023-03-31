import { registerEnumType } from '@nestjs/graphql';

export enum GeoType {
  Province = 'PROVINCE',
  District = 'DISTRICT',
  Ward = 'WARD',
}
registerEnumType(GeoType, { name: 'GeoType' });
