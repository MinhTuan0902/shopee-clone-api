import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log'] });
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({}));

  const envService = app.get(ENVService);
  const PORT = envService.get(ENVVariable.APIServerPort);

  await app.listen(PORT, () => {
    Logger.log(`API server successfully started on port ${PORT}`);
  });
}
bootstrap();
