import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Axios from 'axios';
import { Episode } from '../shared/episode.entity';
import { ProviderTokens } from '../constants';
import { CleanText } from '../shared/models/clean-text';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';
import { isStoryProcessed } from '../shared/utils';

@Injectable()
export class TextService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(TextService.name);

  constructor(
    @Inject(ProviderTokens.TEXTS_QUEUE)
    private readonly textsQueue: ClientProxy,
    @InjectRepository(Episode)
    private episodesRepo: Repository<Episode>,
  ) {}

  async handleMessage(podcast: Podcast): Promise<void> {
    const isStoryPrcessed = await isStoryProcessed(
      this.episodesRepo,
      podcast.story.id,
    );
    if (isStoryPrcessed) {
      this.logger.warn(
        `Story ${podcast.story.id} is already processed. Skipping...`,
      );
      return;
    }

    podcast.text = await this.extractTextFromArticle(podcast.story.url);
    await this.textsQueue.emit('texts', podcast).toPromise();
  }

  async extractTextFromArticle(url: string): Promise<CleanText> {
    // TODO handle rate limits. see https://extractarticletext.com/docs/#section/Overview/API-Key

    // TODO this API doesn't handle query strings well!
    let sanitizedUrl = url;
    const fragmentStart = sanitizedUrl.indexOf('#');
    if (fragmentStart > 0) {
      sanitizedUrl = sanitizedUrl.substring(0, fragmentStart);
    }
    const queryStringStart = sanitizedUrl.indexOf('?');
    if (queryStringStart > 0) {
      sanitizedUrl = sanitizedUrl.substring(0, queryStringStart);
    }
    const apikey = `${process.env.HNP_EXTRACTOR_API_KEY}`;
    const resp = await Axios.get('extractor', {
      baseURL: `https://extractorapi.com/api/v1`,
      params: {
        apikey,
        url: sanitizedUrl,
        fields: ['title', 'author', 'date_published', 'images'].join(','),
      },
      validateStatus: () => true,
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
