import { connect, Connection, ConfirmChannel } from "amqplib";

export class MessageQueueService<TMessage> {
  private _connStr: string;
  private _exchange: string;
  private _queue: string;
  private _connection: Connection;
  private _channel: ConfirmChannel;

  /**
   * @param {string} connectionString AMQP connection string
   * @param {string} queue Name of the queue
   */
  constructor(connectionString: string, queue: string, exchange = "amq.topic") {
    this._connStr = connectionString;
    this._queue = queue;
    this._exchange = exchange;
  }

  get queue() {
    return this._queue;
  }

  ensureConnection = async () => {
    if (!this._connection) {
      this._connection = await connect(this._connStr);
      this._channel = await this._connection.createConfirmChannel();
      await this._channel.assertExchange(this._exchange, "topic", {
        durable: true,
      });
      const queueInfo = await this._channel.assertQueue(this.queue);
      await this._channel.bindQueue(this.queue, this._exchange, this.queue);
      console.info(JSON.stringify(queueInfo));
    }
  };

  enqueue = (message: TMessage): Promise<void> =>
    this.ensureConnection().then(
      () =>
        new Promise((resolve, reject) => {
          this._channel.publish(
            this._exchange,
            this.queue,
            Buffer.from(JSON.stringify(message)),
            {},
            (err) => (err ? reject(err) : resolve())
          );
        })
    );

  dequeue = () => this.getMessage();

  peek = () => this.getMessage(false);

  private getMessage = async (ackMessage = true) => {
    await this.ensureConnection();
    const result = await this._channel.get(this.queue, { noAck: ackMessage });
    if (result === false) {
      return null;
    } else {
      const content = result.content.toString();
      const obj = JSON.parse(content);
      return obj as TMessage;
    }
  };
}
