import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { getRabbitmqOptions } from './config/rabbitmq-config';
import { ProviderTokens } from './constants';
import { TasksService } from './shared/tasks.service';
import { StoryService } from './story/story.service';
import { TextService } from './text/text.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: ProviderTokens.STORIES_QUEUE,
        ...(getRabbitmqOptions('stories') as any),
      },
      {
        name: ProviderTokens.TEXTS_QUEUE,
        ...(getRabbitmqOptions('texts') as any),
      },
      {
        name: ProviderTokens.AUDIOS_QUEUE,
        ...(getRabbitmqOptions('audios') as any),
      },
      {
        name: ProviderTokens.PODCASTS_QUEUE,
        ...(getRabbitmqOptions('podcasts') as any),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [StoryService, TasksService, TextService],
})
export class AppModule {}
