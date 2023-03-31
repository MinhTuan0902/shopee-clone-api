import { registerEnumType } from '@nestjs/graphql';

export enum Locale {
  Vietnamese = 'vi',
  EnglishUS = 'en-us',
}
registerEnumType(Locale, { name: 'Locale' });
