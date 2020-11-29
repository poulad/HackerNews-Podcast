import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { Episode } from './podcast/episode.entity';

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

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.HNP_PG_HOST || 'localhost',
    port: parseInt(process.env.HNP_PG_PORT || '3306'),
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false, // See https://github.com/typeorm/typeorm/issues/278
      },
    },
    username: process.env.HNP_PG_USER || 'root',
    password: process.env.HNP_PG_PASS || 'root',
    database: process.env.HNP_PG_DB || 'test',
    entities: ENTITIES_LIST,
  };
}

export const ENTITIES_LIST = [Episode];
