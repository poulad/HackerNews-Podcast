import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export function getAllQueueNames() {
  return ['stories', 'texts', 'audios', 'podcasts'];
}

export function getAvailableQueueNames() {
  const excluded = (process.env.HNP_AMQP_QUEUES_EXCLUDED || '')
    .split(';')
    .filter((q) => q.length > 0);
  return getAllQueueNames().filter((q) => !excluded.includes(q));
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
