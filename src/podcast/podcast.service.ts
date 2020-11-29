import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProviderTokens } from '../constants';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';

@Injectable()
export class PodcastService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(PodcastService.name);

  constructor(
    @Inject(ProviderTokens.PODCASTS_QUEUE)
    private readonly podcastsQueue: ClientProxy,
  ) {}

  async handleMessage(podcast: Podcast): Promise<void> {
    throw new Error(`Not implemented`);
  }
}
