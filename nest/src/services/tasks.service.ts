import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import Axios, { AxiosResponse } from 'axios';
import { HackerNewsStory } from '../models/hacker-news-story';
import { MessageQueueService } from './message-queue.service';

@Injectable()
export class TasksService {
  STORY_LIMIT = 2;
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly storiesQueue: MessageQueueService) {}

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

    await this.storiesQueue.ensureConnected();
    stories.forEach((s) => this.storiesQueue.sendToQueue('stories', s));
  }
}
