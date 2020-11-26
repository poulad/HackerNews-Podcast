import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern()
  consumeMessage(_, @Ctx() context: RmqContext) {
    console.log(`Pattern: ${context.getPattern()}`);

    const channel: ConfirmChannel = context.getChannelRef();
    const msg = context.getMessage() as ConsumeMessage;

    console.log(`Message: ${JSON.stringify(msg.content)}`);
    const data = JSON.parse(msg.content.toString());
    channel.ack(data);
  }
}
