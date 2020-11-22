import { connect, Connection, ConfirmChannel, Channel } from "amqplib";
import * as polly from "polly-js";

// TODO have a limit for number of channels open.

export class ConnectionManager {
  private _connection: Connection;
  private _channels: Channel[];

  constructor(private _connectionString: string) {}

  /**
   * Establishes a TCP connection to RabbitMQ broker.
   * @param retry number of retries
   */
  connect = this.ensureConnected;

  /**
   * Creates a channel in confirm mode on the current connection and sets a global consumer prefetch limit.
   * @param unackLimit Number of concurrent unacknowledged messages received on this channel.
   * See https://www.rabbitmq.com/consumer-prefetch.html.
   */
  async createChannelInConfirmMode(unackLimit = 1): Promise<ConfirmChannel> {
    if (!Number.isInteger(unackLimit)) throw new Error();
    if (unackLimit < 1) throw new Error();

    await this.ensureConnected();
    const ch = await this._connection.createConfirmChannel();
    // TODO handle channel failures. Possibly, re-establish connection
    this._channels.push(ch);

    await ch.prefetch(unackLimit, true);

    return ch;
  }

  async disconnect() {
    if (this._connection) {
      for (const ch of this._channels || []) {
        try {
          await ch.close();
        } catch (e) {
          // TODO log issue
        }
      }
      try {
        await this._connection.close();
      } catch (e) {
        // TODO log issue
      }
      this._connection = null;
    }
  }

  private ensureConnected(retry = 0): Promise<void> {
    if (!this._connection) {
      if (!Number.isInteger(retry)) throw new Error();
      if (retry < 0) throw new Error();

      // TODO retry
      // TODO log failures
      return polly()
        .waitAndRetry(retry)
        .executeForPromise(() => connect(this._connectionString))
        .then((connection) => {
          this._connection = connection;
          this._channels = [];
        });
    }
  }
}
