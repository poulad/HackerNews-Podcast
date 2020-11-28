import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Timeout } from '@nestjs/schedule';
import Axios, { AxiosResponse } from 'axios';
import { ProviderTokens } from 'src/constants';
import { HackerNewsStory } from '../models/hacker-news-story';

@Injectable()
export class TasksService {
  STORY_LIMIT = 2;
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject(ProviderTokens.STORIES_QUEUE)
    private readonly storiesQueue: ClientProxy,
  ) {}

  @Timeout(1_000)
  async getTopHackerNewsStories() {
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
      if (stories.length === this.STORY_LIMIT) {
        break;
      }
    }

    stories.forEach((s) => this.storiesQueue.emit('stories', s));
  }
}
