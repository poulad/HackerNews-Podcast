import amqplib from "amqplib";

export class MessageQueueService {
  /**
   * @type {string}
   */
  #connStr = null;

  /**
   * @type {string}
   */
  #queueName = null;

  /**
   * @type {import("amqplib").Connection}
   */
  #connection = null;

  /**
   * @type {import("amqplib").Channel}
   */
  #channel = null;

  /**
   * @param {string} connectionString AMQP connection string
   * @param {string} queue Name of the queue
   */
  constructor(connectionString, queue) {
    this.#connStr = connectionString;
    this.#queueName = queue;
  }

  get queue() {
    return this.#queueName;
  }

  #ensureConnection = async () => {
    if (!this.#connection) {
      this.#connection = await amqplib.connect(this.#connStr);
      this.#channel = await this.#connection.createChannel();
      const queueInfo = await this.#channel.assertQueue(this.#queueName);
      console.info(JSON.stringify(queueInfo));
    }
  };

  enqueue = async (message) => {
    await this.#ensureConnection();
    const result = await this.#channel.sendToQueue(
      this.#queueName,
      Buffer.from(JSON.stringify(message))
    );
    if (result !== true) {
      throw new Error(`Failed to enqueue message.`);
    }
  };

  dequeue = () => this.#getMessage();

  peek = () => this.#getMessage(false);

  #getMessage = async (ackMessage = true) => {
    await this.#ensureConnection();
    const result = await this.#channel.get(this.#queueName, {
      noAck: ackMessage,
    });
    if (result === false) {
      return null;
    } else {
      const content = result.content.toString();
      const obj = JSON.parse(content);
      return obj;
    }
  };
}
