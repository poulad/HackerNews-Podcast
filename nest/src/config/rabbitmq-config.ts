import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export default () => ({
  rabbitmq: {
    uri: process.env.AMQP_URI || 'amqp://localhost:5672',
  },
});

export function getRabbitmqOptions(queue: string): MicroserviceOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URI],
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
