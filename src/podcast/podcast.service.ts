import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderTokens } from '../constants';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';
import { Episode } from './episode.entity';

@Injectable()
export class PodcastService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(PodcastService.name);

  constructor(
    @Inject(ProviderTokens.PODCASTS_QUEUE)
    private readonly podcastsQueue: ClientProxy,
    @InjectRepository(Episode)
    private episodesRepo: Repository<Episode>,
  ) {}

  async handleMessage(podcast: Podcast): Promise<void> {
    try {
      // TODO upsert instead
      // TODO or if message is duplicated, put it on an errors queue
      const res = await this.episodesRepo.save({
        storyId: podcast.story.id,
        title: podcast.story.title,
        audioUrl: podcast.audio.file,
        audioSize: podcast.audio.length,
        duration: 60, // TODO seconds
        pubilshedAt: new Date(podcast.story.time),
      });
      res.id;
    } catch (e) {
      this.logger.warn(e);
    }

    throw new Error(`Not implemented`);
  }
}
