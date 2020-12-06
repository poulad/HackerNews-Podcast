export interface LogEvent {
  '@timestamp': string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'verbose';
  message: string;
  context: string;
  trace?: string;
}
