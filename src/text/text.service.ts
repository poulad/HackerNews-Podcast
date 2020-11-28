import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Axios from 'axios';
import { ProviderTokens } from '../constants';
import { CleanText } from '../shared/models/clean-text';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';

@Injectable()
export class TextService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(TextService.name);

  constructor(
    @Inject(ProviderTokens.TEXTS_QUEUE)
    private readonly textsQueue: ClientProxy,
  ) {}

  async handleMessage(podcast: Podcast): Promise<void> {
    podcast.text = await this.extractTextFromArticle(podcast.story.url);
    await this.textsQueue.emit('texts', podcast).toPromise();
  }

  async extractTextFromArticle(url: string): Promise<CleanText> {
    // TODO handle rate limits. see https://extractarticletext.com/docs/#section/Overview/API-Key
    const apikey = `${process.env.EXTRACTOR_API_KEY}`;
    const resp = await Axios.get('extractor', {
      baseURL: 'https://extractorapi.com/api/v1',
      params: { apikey, url },
    });
    if (resp.status === 200) {
      return resp.data;
    } else {
      throw new Error(
        `Error ${resp.status} ${resp.statusText} ${JSON.parse(resp.data)}`,
      );
    }
  }
}
