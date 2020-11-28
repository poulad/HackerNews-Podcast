import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Axios, { AxiosResponse } from 'axios';
import { QueueMessageHandler } from 'src/shared/queue-message-handler';
import { ProviderTokens } from '../constants';
import { HackerNewsStory } from '../models/hacker-news-story';
import { Podcast } from '../models/podcast';

@Injectable()
export class StoryService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(StoryService.name);
  readonly STORY_LIMIT = 2;

  constructor(
    @Inject(ProviderTokens.STORIES_QUEUE)
    private readonly storiesQueue: ClientProxy,
    @Inject(ProviderTokens.TEXTS_QUEUE)
    private readonly textsQueue: ClientProxy,
  ) {}

  async publishTopHackerNewsStories(): Promise<void> {
    this.logger.log(`Getting top HackerNews stories...`);
    let response: AxiosResponse<number[]>;
    try {
      response = await Axios.get(
        `https://hacker-news.firebaseio.com/v0/topstories.json`,
      );
    } catch (e) {
      this.logger.warn(e);
    }

    const stories: HackerNewsStory[] = [];

    for (const id of response.data) {
      let itemResponse: AxiosResponse<HackerNewsStory>;
      try {
        itemResponse = await Axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        );
      } catch (e) {
        this.logger.warn(e);
      }
      if (itemResponse.data.type !== 'story') {
        continue;
      }
      stories.push(itemResponse.data);
      if (stories.length >= this.STORY_LIMIT) {
        break;
      }
    }

    this.logger.log(`There are ${stories.length} new stories.`);

    stories
      .map((story) => ({ story } as Podcast))
      .forEach((p) => this.storiesQueue.emit('stories', p));
  }

  async handleMessage(podcast: Podcast): Promise<void> {
    this.textsQueue.emit('texts', { foo: 'bar' }).subscribe(
      (val) => {
        this.logger.debug(`VALUE IS ${val}`);
      },
      (err) => {
        this.logger.warn(`ERR IS ${err}`);
      },
      () => {
        this.logger.debug(`DONE`);
      },
    );
  }
}
