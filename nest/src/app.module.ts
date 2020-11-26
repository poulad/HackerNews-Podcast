import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import rabbitmqConfig from 'config/rabbitmq-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rabbitmqConfig],
    }),
    ClientsModule.register([
      {
        name: 'STORIES_SERVICE',
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
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
