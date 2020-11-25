import { ConfirmChannel, ConsumeMessage } from "amqplib";
import { Subject } from "rxjs";
import { ConnectionManager } from "./connection-manager";
import { MessageSerializer } from "./message-serializer";
import { Message } from "./message";

export class QueueConsumer<TPayload> {
  private _channel: ConfirmChannel;
  private _queue: string;
  private _conn: ConnectionManager;
  private _serializer: MessageSerializer<TPayload>;
  private _tag: string;
  private _subject: Subject<Message<TPayload>>;

  constructor(
    queue: string,
    conn: ConnectionManager,
    serializer: MessageSerializer<TPayload>,
    tag?: string
  ) {
    // TODO validations
    this._queue = queue;
    this._conn = conn;
    this._serializer = serializer;

    if (`${tag}`.length > 1) {
      // santizie name
      this._tag = tag;
    }
  }

  get queue() {
    return this._queue;
  }

  async startConsumingQueue() {
    this._channel = await this._conn.createChannelInConfirmMode();
    this._channel.on("close", () => this.stopConsumingQueue(null, "close"));
    this._channel.on("error", (err) => this.stopConsumingQueue(err, "error"));

    this._subject = new Subject<Message<TPayload>>();

    const { consumerTag } = await this._channel.consume(
      this.queue,
      (consumeMsg) => this.processReceivedMessage(consumeMsg),
      { noAck: false, consumerTag: this._tag }
    );
    this._tag = consumerTag; // Broker generates a consumer tag if none is provided by client.
    return this._subject.asObservable();
  }

  async stopConsumingQueue(reason?: any, event?: string) {
    if (event) {
      console.warn(`EVENT of ${event}`);
    }
    if (reason) {
      console.warn(
        `Consumer ${JSON.stringify(
          this._tag
        )} is stopping consumption of the queue due to`,
        reason
      );
    }
    if (this._channel) {
      try {
        await this._channel.close();
      } catch (e) {
        console.warn(`Failed to close channel`, e);
      }
      this._channel = null;
    }
    this._tag = null;

    if (this._subject) {
      this._subject.complete();
      this._subject = null;
    }
  }

  private processReceivedMessage(consumeMsg: ConsumeMessage) {
    if (!consumeMsg) {
      // TODO try removing queue. consumemsg will be null...

      const err = new Error(
        `Received an unexpected message from Broker. Unsubscribing from queue...`
      );
      this._subject.error(err);
      this.stopConsumingQueue(err);
      return;
    }
    console.info(`Received message: ${consumeMsg.content.toString()}`);
    // TODO msg could be null
    let payloadObj: TPayload = null;
    try {
      payloadObj = this._serializer.deserialize(consumeMsg.content);
    } catch (err) {
      // TODO attach more info to err
      // TODO use a error handler e.g. discard or enqueue bad msg to another queue
      this._subject.error(err);
      this.stopConsumingQueue(err);
      // this._channel.ack(consumeMsg);
      return;
    }

    this._subject.next({
      payload: payloadObj,
      acknowledge: () => this._channel.ack(consumeMsg),
      isRedelivered: consumeMsg.fields.redelivered, // TODO read other fields
    });
  }
}
