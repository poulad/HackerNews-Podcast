import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import {
  ENTITIES_LIST,
  getAllQueueNames,
  getRabbitmqOptions,
  getTypeOrmOptions,
} from './config';
import { ProviderTokens } from './constants';
import { AppController } from './app.controller';
import { TasksService } from './shared/tasks.service';
import { StoryService } from './story/story.service';
import { TextService } from './text/text.service';
import { AudioService } from './audio/audio.service';
import { PodcastService } from './podcast/podcast.service';
import { Episode } from './podcast/episode.entity';

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
    TypeOrmModule.forRoot(getTypeOrmOptions()),
    TypeOrmModule.forFeature(ENTITIES_LIST),
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
