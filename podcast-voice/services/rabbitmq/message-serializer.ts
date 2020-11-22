export interface MessageSerializer<TMessage> {
  serialize(message: TMessage): Buffer;

  deserialize(bytes: Buffer): TMessage;
}
