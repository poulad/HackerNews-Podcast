import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { MessageQueueService } from './services/message-queue.service';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [Logger, MessageQueueService, TasksService],
})
export class AppModule {}
