import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ConfirmChannel, Message } from 'amqplib';
import { HackerNewsStory } from './models/hacker-news-story';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern()
  consumeMessage(_: any, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);

    const channel: ConfirmChannel = context.getChannelRef();
    const msg = context.getMessage() as Message;
    const payload: HackerNewsStory = JSON.parse(msg.content.toString());

    console.log(`PAYLOAD: ${JSON.stringify(payload)}`);
    // channel.ack(msg);
  }
}
