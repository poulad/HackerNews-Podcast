export interface Message<TPayload> {
  payload: TPayload;
  isRedelivered: boolean;
  acknowledge: () => void;
}
