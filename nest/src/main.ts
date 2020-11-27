import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(getRabbitmqOptions('stories'));
  app.connectMicroservice<MicroserviceOptions>(getRabbitmqOptions('texts'));

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}

function getRabbitmqOptions(queue: string): MicroserviceOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URI],
      queue,
      isGlobalPrefetchCount: true,
      prefetchCount: 1,
      persistent: true,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  };
}

bootstrap();
