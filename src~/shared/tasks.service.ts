import { Injectable } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { StoryService } from 'src/story/story.service';
import { AppLogger } from './app-logger';

@Injectable()
export class TasksService {
  constructor(
    private readonly storyService: StoryService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(TasksService.name);
  }

  @Timeout(1_000)
  @Cron('0 0 0 * * *', { name: 'End Of Day', utcOffset: 0 })
  async hackerNewsStories(): Promise<void> {
    this.logger.log(`Task ${this.hackerNewsStories.name} is triggered.`);
    try {
      await this.storyService.publishTopHackerNewsStories();
    } catch (e) {
      this.logger.error(
        `Task ${this.hackerNewsStories.name} failed. ${e.message}`,
        e.stack,
      );
      return;
    }
    this.logger.log(
      `Task ${this.hackerNewsStories.name} completed successfully.`,
    );
  }
}
