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
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is started. Listening on port ${port}...`);
}

bootstrap();
