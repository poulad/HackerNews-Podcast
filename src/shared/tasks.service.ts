import { Injectable, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';
import { StoryService } from 'src/story/story.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly storyService: StoryService) {}

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
