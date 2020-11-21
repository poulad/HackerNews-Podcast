import Axios from "axios";
import { mkdirSync, writeFileSync } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import { config as dotenvConfig } from "dotenv";
import { MessageQueueService } from "./services/message-queue-service";
import { HackerNewsStory } from "./models/hacker-news-story";
import { CleanText } from "./models/clean-text";

type StoryText = { story: HackerNewsStory; text: CleanText };

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

function getStoryText(mqService: MessageQueueService<StoryText>) {
  return mqService.peek();
}

function splitTextIntoChunks(text: string): string[] {
  return text
    .split(".")
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => chunk + ".");
}

async function getVoiceChunk(sentence, filename) {
  try {
    const resp = await Axios.get("http://localhost:5002/api/tts", {
      params: {
        text: sentence,
      },
      responseType: "arraybuffer",
    });
    if (resp.status === 200) {
      writeFileSync(filename, resp.data);
    } else {
      console.error(`Failed. ${resp.status}`);
    }
  } catch (e) {
    console.error(`Failed.`, e);
  }
}

/**
 * @param {string[]} chunks
 */
async function combineVoiceChunks(chunks, output) {
  const cunksWithGaps = chunks
    .map((c) => [c, `./sln.wav`])
    .reduce((prev, curr) => [...prev, ...curr], []);
  const commandText = ["sox", ...chunks, output]
    .map((x) => JSON.stringify(x))
    .join(" ");

  const execFn = promisify(exec);
  const { stdout, stderr } = await execFn(commandText);
}

async function main() {
  const dotenvResult = dotenvConfig();
  if (dotenvResult.error) {
    throw dotenvResult.error;
  }

  const textsQueueService = new MessageQueueService<StoryText>(
    process.env.AMQP_URL,
    "texts"
  );
  const voicesQueueService = new MessageQueueService<{}>(
    process.env.AMQP_URL,
    "voices"
  );

  const storyText = await getStoryText(textsQueueService);
  const processedText = {
    ...storyText,
    sentences: splitTextIntoChunks(storyText.text.text),
  };

  mkdirSync(`stories/${processedText.story.id}/`, { recursive: true });
  const audioChunkFiles = [];
  for (let i = 0; i < processedText.sentences.length; i++) {
    audioChunkFiles.push(`stories/${processedText.story.id}/${i}.wav`);
    await getVoiceChunk(
      processedText.sentences[i],
      audioChunkFiles[audioChunkFiles.length - 1]
    );
  }
  await combineVoiceChunks(
    audioChunkFiles,
    `stories/${processedText.story.id}/voice.wav`
  );
}

(async function () {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.error(` --> An error occured!`, e);
    process.exit(1);
  }
})();
