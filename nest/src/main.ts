import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { getRabbitmqOptions } from './config/rabbitmq-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(getRabbitmqOptions('stories'));
  app.connectMicroservice<MicroserviceOptions>(getRabbitmqOptions('texts'));
  app.connectMicroservice<MicroserviceOptions>(getRabbitmqOptions('audios'));

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}

bootstrap();
