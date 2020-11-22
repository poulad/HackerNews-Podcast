import { MessageSerializer } from "./message-serializer";

export class JsonSerializer<TMessage> implements MessageSerializer<TMessage> {
  serialize(message: TMessage): Buffer {
    return Buffer.from(JSON.stringify(message));
  }

  deserialize(bytes: Buffer): TMessage {
    return JSON.parse(bytes.toString());
  }
}
