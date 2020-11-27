import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import rabbitmqConfig from './config/rabbitmq-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageQueueService } from './services/message-queue.service';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rabbitmqConfig],
    }),
    ScheduleModule.forRoot(),
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
  providers: [AppService, MessageQueueService, TasksService],
})
export class AppModule {}
