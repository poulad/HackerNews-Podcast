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

@Controller()
export class AppController {
  constructor(private readonly logger: Logger) {}

  @Get()
  home() {
    return 'hello, world!';
  }

  @EventPattern('stories', Transport.RMQ)
  consumeStoryMessage(@Payload() data: Podcast, @Ctx() context: RmqContext) {
    this.logger.debug(`Received event ${context.getPattern()}`);

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
