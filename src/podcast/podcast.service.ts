import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';
import { Episode } from '../shared/episode.entity';
import { EpisodeDto } from './episode.dto';

@Injectable()
export class PodcastService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(PodcastService.name);

  constructor(
    @InjectRepository(Episode)
    private episodesRepo: Repository<Episode>,
  ) {}

  async handleMessage(podcast: Podcast): Promise<void> {
    // TODO push updates to the frontend

    const episode = await this.episodesRepo.findOne({
      where: { storyId: podcast.story.id },
      select: ['id', 'description'],
    });

    if (!episode) {
      this.logger.error(
        `Episode for sotry ${podcast.story.id} does NOT exist in the database!`,
      );
      return;
    }
    if (episode.description?.length > 1) {
      this.logger.warn(
        `Episode for sotry ${podcast.story.id} is already processed. Skipping...`,
      );
      return;
    }

    this.logger.log(`Processing story ${podcast.story.id}...`);

    // writing sanitized html
    const description = `
<strong>
  <a target="${podcast.story.url}">${podcast.story.title}</a>
</strong>
<br/>
Posted by <code>${podcast.story.by}</code> on ${new Date(
      podcast.story.title,
    ).toLocaleDateString()}.
<br/>
${podcast.story.score} Points
<br/>
`.trim();

    const result = await this.episodesRepo.update(
      { storyId: podcast.story.id },
      { description },
    );
    if (result.affected !== 1) {
      this.logger.warn(
        `Update statement did NOT execute as expected. ${result.affected} , ${result.raw}`,
      );
    }
  }

  async getAllEpisodes(): Promise<EpisodeDto[]> {
    const entities = await this.episodesRepo.find({
      select: [
        'storyId',
        'title',
        'description',
        'audioType',
        'audioSize',
        'duration',
      ],
    });
    return (entities || []).map((e) => ({
      id: e.storyId.toString(),
      title: e.title,
      description: e.description,
      audio: {
        url: `https://hackernews-podcast.herokuapp.com/api/episodes/${e.storyId}/audio.wav`,
        format: e.audioType,
        size: e.audioSize,
      },
      duration: e.duration,
    }));
  }

  async getEpisodeAudio(storyId: number): Promise<Buffer> {
    const entity = await this.episodesRepo.findOne({
      where: { storyId },
      select: ['audioContnet'],
    });

    return entity ? Buffer.from(entity.audioContnet, 'base64') : null;
  }
}
