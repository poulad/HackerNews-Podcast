import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cron } from '@nestjs/schedule';
import { LOG_EVENTS_QUEUE } from './app-logger';
import { LogEvent } from './log-event';

@Injectable()
export class LogTransportService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Cron('*/15 * * * * *')
  async forwardLogs(): Promise<void> {
    console.info(`Forwaring logs to Elasticsearch`);
    // TODO timeout of 13 seconds before the next task starts
    // TODO put the buffer back in the logs queue in case of failures.

    // TODO take logs for max 5 seconds.
    const buffer: LogEvent[] = [];
    while (LOG_EVENTS_QUEUE.length) {
      buffer.push(LOG_EVENTS_QUEUE.shift());
    }
    if (!buffer.length) {
      return;
    }

    const bulkBody = buffer
      .map((doc) => [{ index: { _index: 'logs' } }, doc])
      .reduce((agg, curr) => [...agg, ...curr], []);
    try {
      const stats = await this.elasticsearchService.cluster.stats();
      const response = await this.elasticsearchService.bulk({
        index: 'logs',
        body: bulkBody,
      });
      if (response.statusCode !== 200) {
        console.error(`Failed to ship logs`, JSON.stringify(response));
      }
    } catch (e) {
      console.error(`Failed to ship logs`, JSON.stringify(e));
    }
  }
}
