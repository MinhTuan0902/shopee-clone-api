import { Media, MediaSchema } from '@mongodb/entity/media/media.entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaService } from './media.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Media.name,
        schema: MediaSchema,
      },
    ]),
  ],
  providers: [
    // Services
    MediaService,
  ],
  exports: [MediaService],
})
export class MediaModule {}
