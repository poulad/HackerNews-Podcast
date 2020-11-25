export interface MessageSerializer<TMessage> {
  contnetType: string;

  serialize(message: TMessage): Buffer;

  deserialize(bytes: Buffer): TMessage;
}
