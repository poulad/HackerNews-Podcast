import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import {
  ENTITIES_LIST,
  getAllQueueNames,
  getElasticsearchOptions,
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
import { AppLogger } from './shared/app-logger';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { LogTransportService } from './shared/log-transport.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ElasticsearchModule.register(getElasticsearchOptions()),
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
    AppLogger,
    LogTransportService,
    StoryService,
    TasksService,
    TextService,
    AudioService,
    PodcastService,
  ],
})
export class AppModule {}
