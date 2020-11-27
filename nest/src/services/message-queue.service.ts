import { Injectable } from '@nestjs/common';
import { ConfirmChannel, Connection, connect } from 'amqplib';

@Injectable()
export class MessageQueueService {
  private _channel: ConfirmChannel;
  private _conn: Connection;

  sendToQueue(queue: string, payload: any, eventPattern?: string) {
    const serializedPayload = JSON.stringify({
      data: payload,
      pattern: eventPattern || queue,
    });
    this._channel.sendToQueue(queue, Buffer.from(serializedPayload), {
      persistent: true,
      contentType: 'application/json',
    });
  }

  async ensureConnected() {
    // TODO retry if fails. or re-use the connection open by Nest internally
    if (!this._conn) {
      this._conn = await connect(process.env.AMQP_URI);
    }
    if (!this._channel) {
      this._channel = await this._conn.createConfirmChannel();
    }
  }
}
