import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { getAllQueueNames, getRabbitmqOptions } from './config';
import { ProviderTokens } from './constants';
import { AppController } from './app.controller';
import { TasksService } from './shared/tasks.service';
import { StoryService } from './story/story.service';
import { TextService } from './text/text.service';
import { AudioService } from './audio/audio.service';
import { PodcastService } from './podcast/podcast.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ClientsModule.register(
      getAllQueueNames().map((queue) => ({
        name: ProviderTokens[`${queue}_QUEUE`.toUpperCase()],
        ...(getRabbitmqOptions(queue) as any),
      })),
    ),
  ],
  controllers: [AppController],
  providers: [
    StoryService,
    TasksService,
    TextService,
    AudioService,
    PodcastService,
  ],
})
export class AppModule {}
