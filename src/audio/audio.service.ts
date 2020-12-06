import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Axios from 'axios';
import { join, dirname } from 'path';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs';
import { ProviderTokens } from '../constants';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';
import { delay, execCommand, isStoryProcessed } from '../shared/utils';
import { Episode } from '../shared/episode.entity';
import { getAudiosOutputDirectory } from '../config';

@Injectable()
export class AudioService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(AudioService.name);

  constructor(
    @Inject(ProviderTokens.AUDIOS_QUEUE)
    private readonly audiosQueue: ClientProxy,
    @InjectRepository(Episode)
    private episodesRepo: Repository<Episode>,
  ) {}

  async handleMessage(podcast: Podcast): Promise<void> {
    const isStoryPrcessed = await isStoryProcessed(
      this.episodesRepo,
      podcast.story.id,
    );
    if (isStoryPrcessed) {
      this.logger.warn(
        `Story ${podcast.story.id} is already processed. Skipping...`,
      );
      return;
    }

    this.logger.log(`Processing story ${podcast.story.id}...`);

    podcast.audio = {
      file: join(getAudiosOutputDirectory(), `${podcast.story.id}/audio.wav`),
      format: 'audio/wav',
    };

    const outputDir = dirname(podcast.audio.file);
    this.logger.log(`Output audio directory is ${JSON.stringify(outputDir)}.`);
    mkdirSync(outputDir, { recursive: true });

    const sentences = this.splitTextIntoChunks(podcast.text.text).filter(
      (s) => s.length > 3,
    );
    for (let i = 0; i < sentences.length; i++) {
      const output = `${outputDir}/${i}.wav`;
      if (existsSync(output)) {
        continue;
      }
      await this.synthesizeSpeechForSentence(sentences[i], output);
      await delay(2_000);
    }

    if (!existsSync(podcast.audio.file)) {
      await this.combineAudioChunks(
        sentences.map((_, i) => `${outputDir}/${i}.wav`),
        podcast.audio.file,
      );
    }

    podcast.audio.size = statSync(podcast.audio.file).size;
    podcast.audio.duration = await this.getAudioDuration(podcast.audio.file);

    await this.persistEpisode(podcast);

    delete podcast.text.text;
    await this.audiosQueue.emit('audios', podcast).toPromise();
  }

  private async persistEpisode(podcast: Podcast) {
    const audioContnet = readFileSync(podcast.audio.file, {
      encoding: 'base64',
    });
    try {
      // TODO upsert instead
      // TODO or if message is duplicated, put it on an errors queue
      const entity = await this.episodesRepo.save({
        storyId: podcast.story.id,
        title: podcast.story.title,
        audioSize: podcast.audio.size,
        audioType: podcast.audio.format,
        audioContnet: audioContnet.toString(),
        duration: podcast.audio.duration,
        pubilshedAt: new Date(podcast.story.time),
      });
      entity.id;
    } catch (e) {
      this.logger.warn(e);
    }
  }

  private async synthesizeSpeechForSentence(
    sentence: string,
    filename: string,
  ) {
    try {
      const resp = await Axios.get('http://localhost:5002/api/tts', {
        params: {
          text: sentence,
        },
        responseType: 'arraybuffer',
      });
      if (resp.status === 200) {
        writeFileSync(filename, resp.data);
      } else {
        this.logger.error(`Failed. ${resp.status}`);
      }
    } catch (e) {
      this.logger.error(
        `Failed to sythesize speech via TTS API. ${
          e.response?.data || e.message
        }`,
        e.stack,
      );
    }
  }

  private async combineAudioChunks(chunks: string[], output: string) {
    const { stdout, stderr } = await execCommand('sox', ...chunks, output);
    this.logger.debug(`STDOUT: ${stdout}`);
    this.logger.debug(`STDERR: ${stderr}`);
  }

  private async getAudioDuration(file: string): Promise<number> {
    // see http://sox.sourceforge.net/soxi.html
    const { stdout, stderr } = await execCommand('soxi', '-D', file);
    return parseInt(stdout.trim());
    // const date = new Date(parseFloat(stdout.trim()));
    // return `${date.getHours()}:${date.getMinutes()}:${date.getMinutes()}`;
  }

  private splitTextIntoChunks(text: string): string[] {
    return text
      .split('.')
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0)
      .map((chunk) => chunk + '.');
  }
}
