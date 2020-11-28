import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Axios, { AxiosError } from 'axios';
import { join, dirname } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import { ProviderTokens } from '../constants';
import { Podcast } from '../shared/models/podcast';
import { QueueMessageHandler } from '../shared/queue-message-handler';

@Injectable()
export class AudioService implements QueueMessageHandler<Podcast> {
  private readonly logger = new Logger(AudioService.name);

  constructor(
    @Inject(ProviderTokens.AUDIOS_QUEUE)
    private readonly audiosQueue: ClientProxy,
  ) {}

  async handleMessage(podcast: Podcast): Promise<void> {
    const sentences = this.splitTextIntoChunks(podcast.text.text);

    podcast.audio = {
      file: join(__dirname, `../stories/${podcast.story.id}/audio.wav`),
      format: 'audio/wav',
      length: 1,
    };

    const outputDir = dirname(podcast.audio.file);
    mkdirSync(outputDir, { recursive: true });
    await Promise.all(
      sentences.map((sentence, i) =>
        this.synthesizeSpeechForSentence(sentence, `${outputDir}/${i}.wav`),
      ),
    );

    await this.combineAudioChunks(
      sentences.map((_, i) => `${outputDir}/${i}.wav`),
      podcast.audio.file,
    );

    // delete podcast.text.text;
    await this.audiosQueue.emit('audios', podcast).toPromise();
  }

  private async synthesizeSpeechForSentence(sentence, filename) {
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
        `Failed.`,
        (e as AxiosError).response.data.toString(),
        e,
      );
    }
  }

  private async combineAudioChunks(chunks, output) {
    const cunksWithGaps = chunks
      .map((c) => [c, `./sln.wav`])
      .reduce((prev, curr) => [...prev, ...curr], []);
    const commandText = ['sox', ...chunks, output]
      .map((x) => JSON.stringify(x))
      .join(' ');

    const execFn = promisify(exec);
    const { stdout, stderr } = await execFn(commandText);
  }

  private splitTextIntoChunks(text: string): string[] {
    return text
      .split('.')
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0)
      .map((chunk) => chunk + '.');
  }
}

// const episode = {
//   id: "wiki-wikipedia",
//   name: "The Wikipedia Wiki",
//   sentences: [
//     `Other collaborative online encyclopedias were attempted before Wikipedia, but none were as successful.`,
//     `Wikipedia began as a complementary project for Nupedia, a free online English-language encyclopedia project whose articles were written by experts and reviewed under a formal process.`,
//     `It was founded on March 9, 2000, under the ownership of Bomis, a web portal company.`,
//     `Its main figures were Bomis CEO Jimmy Wales and Larry Sanger, editor-in-chief for Nupedia and later Wikipedia.`,
//     `Nupedia was initially licensed under its own Nupedia Open Content License, but even before Wikipedia was founded, Nupedia switched to the GNU Free Documentation License at the urging of Richard Stallman.`,
//     `Wales is credited with defining the goal of making a publicly editable encyclopedia, while Sanger is credited with the strategy of using a wiki to reach that goal.`,
//     `On January 10, 2001, Sanger proposed on the Nupedia mailing list to create a wiki as a "feeder" project for Nupedia.`,
//     `Launch and early growth.`,
//     `The domains wikipedia-dot-com and wikipedia-dot-org were registered on January 12, 2001 and January 13, 2001 respectively, and Wikipedia was launched on January 15, 2001, as a single English-language edition at www-dot-wikipedia-dot-com, and announced by Sanger on the Nupedi a mailing list.`,
//     `Wikipedia's policy of "neutral point-of-view" was codified in its first few months.`,
//     `Otherwise, there were relatively few rules initially and Wikipedia operated independently of Nupedia.`,
//     `Originally, Bomis intended to make Wikipedia a business for profit.`,
//     `Wikipedia gained early contributors from Nupedia, Slashdot postings, and web search engine indexing.`,
//     `Language editions were also created, with a total of 161 by the end of 2004.`,
//     `Nupedia and Wikipedia coexisted until the former's servers were taken down permanently in 2003, and its text was incorporated into Wikipedia.`,
//     `The English Wikipedia passed the mark of two million articles on September 9, 2007, making it the largest encyclopedia ever assembled, surpassing the Yongle Encyclopedia made during the Ming Dynasty in 1408, which had held the record for almost 600 years.`,
//   ],
// };
