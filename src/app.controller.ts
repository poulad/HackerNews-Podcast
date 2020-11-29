import { Controller, Get, Logger, Redirect } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { ConfirmChannel, Message } from 'amqplib';
import { Podcast } from './shared/models/podcast';
import { AudioService } from './audio/audio.service';
import { TextService } from './text/text.service';
import { PodcastService } from './podcast/podcast.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly textService: TextService,
    private readonly audioService: AudioService,
    private readonly podcastService: PodcastService,
  ) {}

  @Get('*')
  @Redirect('https://hacker-news-podcast.vercel.app')
  home() {}

  @EventPattern('stories', Transport.RMQ)
  async consumeStoryMessage(
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

  @EventPattern('texts', Transport.RMQ)
  async consumeTextMessage(
    @Payload() data: Podcast,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const queue = context.getPattern();
    this.logger.debug(`Received a message on queue ${JSON.stringify(queue)}.`);
    try {
      await this.audioService.handleMessage(data);
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

  @EventPattern('audios', Transport.RMQ)
  async consumeAudioMessage(
    @Payload() data: Podcast,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const queue = context.getPattern();
    this.logger.debug(`Received a message on queue ${JSON.stringify(queue)}.`);
    try {
      await this.podcastService.handleMessage(data);
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
