import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProviderTokens } from 'src/constants';
import { Podcast } from 'src/models/podcast';
import { QueueMessageHandler } from 'src/shared/queue-message-handler';

@Injectable()
export class TextService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(TextService.name);

  constructor(
    @Inject(ProviderTokens.STORIES_QUEUE)
    private readonly storiesQueue: ClientProxy,
  ) {}

  handleMessage(payload: Podcast): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
}
