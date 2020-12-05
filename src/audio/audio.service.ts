import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Axios from 'axios';
import { join, dirname } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import { ProviderTokens } from '../constants';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';
import { delay } from '../shared/utils';
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
    const isStoryPrcessed = await this.isStoryProcessed(podcast.story.id);
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
      length: 1,
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

    await this.combineAudioChunks(
      sentences.map((_, i) => `${outputDir}/${i}.wav`),
      podcast.audio.file,
    );

    await this.persistEpisode(podcast, podcast.audio.file);

    // delete podcast.text.text;
    await this.audiosQueue.emit('audios', podcast).toPromise();
  }

  private async isStoryProcessed(storyId: number): Promise<boolean> {
    const entity = await this.episodesRepo.findOne({ where: { storyId } });
    return !!entity;
  }

  private async persistEpisode(podcast: Podcast, filePath: string) {
    const audioContnet = readFileSync(filePath, { encoding: 'base64' });
    try {
      // TODO upsert instead
      // TODO or if message is duplicated, put it on an errors queue
      const entity = await this.episodesRepo.save({
        storyId: podcast.story.id,
        title: podcast.story.title,
        audioSize: podcast.audio.length,
        audioType: podcast.audio.format,
        audioContnet: audioContnet.toString(),
        duration: 60, // TODO seconds
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
          file: filename,
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
    const commandText = ['sox', ...chunks, output]
      .map((x) => JSON.stringify(x))
      .join(' ');

    const execFn = promisify(exec);
    const { stdout, stderr } = await execFn(commandText);
    this.logger.debug(`STDOUT: ${stdout}`);
    this.logger.debug(`STDERR: ${stderr}`);
  }

  private splitTextIntoChunks(text: string): string[] {
    return text
      .split('.')
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0)
      .map((chunk) => chunk + '.');
  }
}
