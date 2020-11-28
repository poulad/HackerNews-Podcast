export interface QueueMessageHandler<TPayload> {
  handleMessage(payload: TPayload): Promise<void> | void;
}
