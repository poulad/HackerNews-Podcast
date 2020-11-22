import { MessageSerializer } from "./message-serializer";

export class ProtobuffSerializer<TMessage>
  implements MessageSerializer<TMessage> {
  constructor() {}

  serialize(message: TMessage): Buffer {
    throw new Error("Method not implemented.");
  }

  deserialize(bytes: Buffer): TMessage {
    throw new Error("Method not implemented.");
  }
}
