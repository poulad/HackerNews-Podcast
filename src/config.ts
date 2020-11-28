import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export function getQueuesList() {
  return (process.env.HNP_AMQP_QUEUES || 'stories;texts;;audios;podcasts')
    .split(';')
    .filter((q) => q.length > 0);
}

export function getRabbitmqOptions(queue: string): MicroserviceOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.HNP_AMQP_URL || 'amqp://localhost:5672'],
      queue,
      isGlobalPrefetchCount: true,
      prefetchCount: 1,
      persistent: true,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  };
}
