import { registerEnumType } from '@nestjs/graphql';

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}
registerEnumType(Gender, { name: 'Gender' });
