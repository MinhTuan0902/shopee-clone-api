import { registerEnumType } from '@nestjs/graphql';

export enum Mimetype {
  Png = 'image/png',
  Jpeg = 'image/jpeg',
  Jpg = 'image/jpg',
  Webp = 'image/webp',
  Mp4 = 'video/mp4',
}
registerEnumType(Mimetype, { name: 'Mimetype' });
