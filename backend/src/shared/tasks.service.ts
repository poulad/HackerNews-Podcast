import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { StoryService } from 'src/story/story.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly storyService: StoryService) {}

  @Timeout(1_000)
  async hackerNewsStories(): Promise<void> {
    this.logger.log(`Task ${this.hackerNewsStories.name} is triggered.`);
    try {
      await this.storyService.publishTopHackerNewsStories();
    } catch (e: Error | any) {
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
