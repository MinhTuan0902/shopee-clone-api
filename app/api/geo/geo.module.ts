import { Geo, GeoSchema } from '@mongodb/entity/geo/geo.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressValidator } from './validator/address.validator';

@Module({
  imports: [MongooseModule.forFeature([{ name: Geo.name, schema: GeoSchema }])],
  providers: [AddressValidator],
  exports: [AddressValidator],
})
export class GeoModule {}
