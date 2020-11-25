import * as protobuf from "protobufjs";
import { MessageSerializer } from "./message-serializer";

export class ProtobufSerializer<TMessage>
  implements MessageSerializer<TMessage> {
  constructor() {}
  get contnetType() {
    return "";
  }

  serialize(message: TMessage): Buffer {
    throw new Error("Method not implemented.");
  }

  deserialize(bytes: Buffer): TMessage {
    throw new Error("Method not implemented.");
  }
}
