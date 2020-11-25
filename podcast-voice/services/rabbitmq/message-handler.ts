import { Message } from "./message";

export interface MessageHandler<TPayload> {
  handle(message: Message<TPayload>): void;
}
