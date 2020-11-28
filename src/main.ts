import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { getAvailableQueueNames, getRabbitmqOptions } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  getAvailableQueueNames()
    .map((queue) => ({
      queue,
      rmqOptions: getRabbitmqOptions(queue),
    }))
    .forEach(({ queue, rmqOptions }) => {
      app.connectMicroservice<MicroserviceOptions>(rmqOptions);
      console.log(`Consuming queue ${JSON.stringify(queue)}...`);
    });

  await app.startAllMicroservicesAsync();
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port);
  console.log(`Application is started. Listening on port ${port}...`);
}

bootstrap();
