import { Controller, Get, Inject, Logger } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import { ConfirmChannel, Message } from 'amqplib';
import { ProviderTokens } from './constants';
import { Podcast } from './models/podcast';

@Controller()
export class AppController {
  constructor(
    @Inject(ProviderTokens.TEXTS_QUEUE)
    private readonly textsQueue: ClientProxy,
    @Inject(ProviderTokens.AUDIOS_QUEUE)
    private readonly auidiosQueue: ClientProxy,
    @Inject(ProviderTokens.PODCASTS_QUEUE)
    private readonly podcastsQueue: ClientProxy,
    private readonly logger: Logger,
  ) {}

  @Get()
  home() {
    return 'hello, world!';
  }

  @EventPattern('stories', Transport.RMQ)
  consumeStoryMessage(@Payload() data: Podcast, @Ctx() context: RmqContext) {
    this.logger.debug(`Received event ${context.getPattern()}`);

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

    const channel: ConfirmChannel = context.getChannelRef();
    const msg = context.getMessage() as Message;

    this.logger.log(`PAYLOAD: ${JSON.stringify(data)}`);
    channel.ack(msg);
  }

  @EventPattern('texts', Transport.RMQ)
  consumeTextMessage(@Payload() data: Podcast, @Ctx() context: RmqContext) {
    this.logger.debug(`Received event ${context.getPattern()}`);

    const channel: ConfirmChannel = context.getChannelRef();
    const msg = context.getMessage() as Message;

    this.logger.log(`PAYLOAD: ${JSON.stringify(data)}`);
    channel.ack(msg);
  }
}
