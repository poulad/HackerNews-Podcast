import { Controller, Get, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { ConfirmChannel, Message } from 'amqplib';
import { Podcast } from './models/podcast';
import { StoryService } from './story/story.service';
import { TextService } from './text/text.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly storyService: StoryService,
    private readonly textService: TextService,
  ) {}

  @Get()
  home() {
    return 'hello, world!';
  }

  @EventPattern('stories', Transport.RMQ)
  async consumeStoryMessage(
    @Payload() data: Podcast,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const queue = context.getPattern();
    this.logger.debug(`Received a message on queue ${JSON.stringify(queue)}.`);

    try {
      await this.storyService.handleMessage(data);
    } catch (e) {
      this.logger.error(
        `Failed to handle message on queue ${JSON.stringify(queue)}. ${
          e.message
        }`,
        e.stack,
      );
      return;
    }

    this.logger.debug(
      `Message from queue ${JSON.stringify(
        queue,
      )} was processed successfully. Acknowledging the message...`,
    );
    const channel = context.getChannelRef() as ConfirmChannel;
    const message = context.getMessage() as Message;
    channel.ack(message);
  }

  @EventPattern('texts', Transport.RMQ)
  async consumeTextMessage(
    @Payload() data: Podcast,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const queue = context.getPattern();
    this.logger.debug(`Received a message on queue ${JSON.stringify(queue)}.`);

    try {
      await this.textService.handleMessage(data);
    } catch (e) {
      this.logger.error(
        `Failed to handle message on queue ${JSON.stringify(queue)}. ${
          e.message
        }`,
        e.stack,
      );
      return;
    }

    this.logger.debug(
      `Message from queue ${JSON.stringify(
        queue,
      )} was processed successfully. Acknowledging the message...`,
    );
    const channel = context.getChannelRef() as ConfirmChannel;
    const message = context.getMessage() as Message;
    channel.ack(message);
  }
}
