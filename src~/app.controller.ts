import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Redirect,
  Res,
} from '@nestjs/common';
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
import { EpisodeDto } from './podcast/episode.dto';
import { ServerResponse } from 'http';
import { AppLogger } from './shared/app-logger';

@Controller()
export class AppController {
  constructor(
    private readonly textService: TextService,
    private readonly audioService: AudioService,
    private readonly podcastService: PodcastService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AppController.name);
    this.logger.info(`starting app controller`);
  }

  @Get('api/episodes')
  async getEpisodes() {
    this.logger.debug('service.endpoint.api.get.episodes');

    let responseStatus = 200;
    const response = {
      data: null as EpisodeDto[],
      error: null,
    };
    try {
      response.data = await this.podcastService.getAllEpisodes();
    } catch (e) {
      this.logger.error(`Failed to get the episodes. ${e.message}`, e.stack);
      responseStatus = 500;
      response.error.message = 'Unexpected error happened!';
    }

    return response;
  }

  @Get('api/episodes/:storyId/audio.wav')
  async getEpisodeAudioFile(@Param() params: any, @Res() res: ServerResponse) {
    const storyId = parseInt(params.storyId);
    if (!storyId) {
      throw new BadRequestException(null, `Invalid episode ID.`);
    }

    const content = await this.podcastService.getEpisodeAudio(storyId);
    if (!content) {
      throw new BadRequestException(null, `Episode not found.`);
    }
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', content.length);
    // TODO stream the binary contnet
    res.write(content);
  }

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
