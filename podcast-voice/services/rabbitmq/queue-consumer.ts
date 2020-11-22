import { ConfirmChannel } from "amqplib";
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

    this._subject = new Subject<Message<TPayload>>();
  }

  get queue() {
    return this._queue;
  }

  get stream() {
    return this._subject.asObservable();
  }

  async consumeQueue() {
    this._channel = await this._conn.createChannelInConfirmMode();
    // TODO register to channel's close events and close the stream.
    const { consumerTag } = await this._channel.consume(
      this.queue,
      (consumeMsg) => {
        if (!consumeMsg) {
          // TODO try removing queue. consumemsg will be null...
          console.error(
            `Received an unexpected message from Broker. Unsubscribing from queue...`
          );
          this.unsubscribeFromQueue(); // TODO await
          return;
        }
        console.info(`Received message: ${consumeMsg.content.toString()}`);
        // TODO msg could be null
        const msg = this._serializer.deserialize(consumeMsg.content);
        // TODO: for serialization errors: this._subject.error()
        this._subject.next({
          payload: msg,
          acknowledge: () => this._channel.ack(consumeMsg),
          isRedelivered: consumeMsg.fields.redelivered, // TODO read other fields
        });
      },
      { noAck: false, consumerTag: this._tag }
    );
    this._tag = consumerTag; // Broker generates a consumer tag if none is provided by client.
    return this.stream;
  }

  async unsubscribeFromQueue() {
    // close stream
    // close channel
  }
}
