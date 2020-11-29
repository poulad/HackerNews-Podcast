import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProviderTokens } from '../constants';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';
import { Episode } from '../shared/episode.entity';
import { EpisodeDto } from './episode.dto';

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
    // TODO push updates to the frontend
    throw new Error(`Not implemented`);
  }

  async getAllEpisodes(): Promise<EpisodeDto[]> {
    const entities = await this.episodesRepo.find({
      select: [
        'storyId',
        'title',
        'description',
        'audioType',
        'audioSize',
        'duration',
      ],
    });
    return (entities || []).map((e) => ({
      id: e.storyId.toString(),
      title: e.title,
      description: e.description,
      audio: {
        url: `https://hackernews-podcast.herokuapp.com/api/episodes/${e.storyId}/audio.wav`,
        format: e.audioType,
        size: e.audioSize,
      },
      duration: e.duration,
    }));
  }

  async getEpisodeAudio(storyId: number): Promise<Buffer> {
    const entity = await this.episodesRepo.findOne({
      where: { storyId },
      select: ['audioContnet'],
    });

    return entity ? Buffer.from(entity.audioContnet, 'base64') : null;
  }
}
