import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AudioService } from './audio/audio.service';
import { getQueuesList, getRabbitmqOptions } from './config';
import { ProviderTokens } from './constants';
import { TasksService } from './shared/tasks.service';
import { StoryService } from './story/story.service';
import { TextService } from './text/text.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ClientsModule.register(
      getQueuesList().map((queue) => ({
        name: ProviderTokens[`${queue}_QUEUE`.toUpperCase()],
        ...(getRabbitmqOptions(queue) as any),
      })),
    ),
  ],
  controllers: [AppController],
  providers: [StoryService, TasksService, TextService, AudioService],
})
export class AppModule {}
