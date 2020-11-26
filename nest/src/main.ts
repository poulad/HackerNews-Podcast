import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AMQP_URI],
        queue: 'stories',
        isGlobalPrefetchCount: true,
        prefetchCount: 1,
        persistent: true,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  await app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
