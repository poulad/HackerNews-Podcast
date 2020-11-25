import { ConfirmChannel } from "amqplib";
import { Observable, Subscription } from "rxjs";
import { ConnectionManager } from "./connection-manager";
import { MessageSerializer } from "./message-serializer";

export class QueueProducer<TPayload> {
  private _channel: ConfirmChannel;
  private _queue: string;
  private _conn: ConnectionManager;
  private _serializer: MessageSerializer<TPayload>;
  private _subscription: Subscription;

  constructor(
    queue: string,
    conn: ConnectionManager,
    serializer: MessageSerializer<TPayload>
  ) {
    // TODO validations
    this._queue = queue;
    this._conn = conn;
    this._serializer = serializer;
  }

  get queue() {
    return this._queue;
  }

  produce(payload: TPayload) {
    const serializedPayload = this._serializer.serialize(payload);
    this._channel.sendToQueue(this.queue, serializedPayload, {
      persistent: true,
      contentType: this._serializer.contnetType,
    });
  }

  async pipeToQueue(observable: Observable<TPayload>) {
    await this.establishChannel();
    this._subscription = observable.subscribe((payload) => {
      this.produce(payload);
    });
  }

  async establishChannel() {
    if (!this._channel) {
      this._channel = await this._conn.createChannelInConfirmMode();
      // TODO try to re-connect if channel was closed
      // stop subscription
    }
  }
}
