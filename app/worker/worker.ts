import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

async function bootstrapWorker() {
  await NestFactory.createApplicationContext(WorkerModule);
  Logger.log('Worker service successfully started');
}

bootstrapWorker();
