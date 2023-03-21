import { ENVVariable } from '@common/module/env/env.constant';
import { ENVService } from '@common/module/env/env.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  const envService = app.get(ENVService);
  const PORT = envService.get(ENVVariable.APIServerPort);

  Logger.log(`API server is running on port ${PORT}`);

  await app.listen(PORT);
}
bootstrap();
