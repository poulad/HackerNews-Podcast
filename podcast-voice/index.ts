import Axios, { AxiosError } from "axios";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { config as dotenvConfig } from "dotenv";
import { MessageQueueService } from "./services/message-queue-service";
import { Podcast } from "./models/podcast";
import { ConnectionManager } from "./services/rabbitmq/connection-manager";
import { QueueConsumer } from "./services/rabbitmq/queue-consumer";
import { JsonSerializer } from "./services/rabbitmq/json-serializer";
import { getTopStories } from "./handlers/story";
import { StoryMessageHandler } from "./handlers/story-message-handler";
import { Subject } from "rxjs";
import { HackerNewsStory } from "./models/hacker-news-story";
import { QueueProducer } from "./services/rabbitmq/queue-producer";

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

function getStoryText(queue: MessageQueueService<Podcast>) {
  return queue.peek();
}

function splitTextIntoChunks(text: string): string[] {
  return text
    .split(".")
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => chunk + ".");
}

async function synthesizeSpeechForSentence(sentence, filename) {
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
    console.error(`Failed.`, (e as AxiosError).response.data.toString(), e);
  }
}

/**
 * @param {string[]} chunks
 */
async function combineAudioChunks(chunks, output) {
  const cunksWithGaps = chunks
    .map((c) => [c, `./sln.wav`])
    .reduce((prev, curr) => [...prev, ...curr], []);
  const commandText = ["sox", ...chunks, output]
    .map((x) => JSON.stringify(x))
    .join(" ");

  const execFn = promisify(exec);
  const { stdout, stderr } = await execFn(commandText);
}

let rabbitmqConnection: ConnectionManager;
let storiesSubject: Subject<Podcast>;
let textsSubject: Subject<Podcast>;

function shutdown(signal: string) {
  // See https://nodejs.org/api/process.html?#process_signal_events
  console.warn(`Recieved signal "${signal}". Shutting down...`);
  let isShutdownSuccessful = true;
  if (rabbitmqConnection) {
    console.warn(`Closing RabbitMQ connection...`);
    // TODO close rxjs streams. wait for them to be handled.
    rabbitmqConnection
      .disconnect()
      .then(() => {
        console.info(`RabbitMQ connection is closed.`);
      })
      .catch((e) => {
        console.error(`Failed to close RabbitMQ connection.`, e);
        isShutdownSuccessful = false;
      })
      .finally(() => {
        process.exit(isShutdownSuccessful ? 0 : 2);
      });
  } else {
    process.exit(isShutdownSuccessful ? 0 : 2);
  }
}

function initSubjects() {
  storiesSubject = new Subject<Podcast>();
  textsSubject = new Subject<Podcast>();
}

async function initQueues() {
  const ch = await rabbitmqConnection.createChannelInConfirmMode();
  await Promise.all(
    ["stories", "texts", "audios", "podcasts"].map((q) => ch.assertQueue(q))
  );
  await ch.close();
}

async function startQueueProducers() {
  const storiesProducer = new QueueProducer<Podcast>(
    "stories",
    rabbitmqConnection,
    new JsonSerializer()
  );
  await storiesProducer.establishChannel();
  await storiesProducer.pipeToQueue(storiesSubject.asObservable());

  const textsProducer = new QueueProducer<Podcast>(
    "texts",
    rabbitmqConnection,
    new JsonSerializer()
  );
  await textsProducer.establishChannel();
  await textsProducer.pipeToQueue(textsSubject.asObservable());
}

async function startQueueConsumers() {
  const storiesConsumer = new QueueConsumer<Podcast>(
    "stories",
    rabbitmqConnection,
    new JsonSerializer<Podcast>(),
    new StoryMessageHandler(textsSubject.next)
  );
  await storiesConsumer.startConsumingQueue();
}

async function main() {
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
  process.once("SIGHUP", shutdown);

  const dotenvResult = dotenvConfig();
  if (dotenvResult.error) {
    throw dotenvResult.error;
  }
  rabbitmqConnection = new ConnectionManager(process.env.AMQP_URI);
  // const qpub = new MessageQueueService<Podcast>(process.env.AMQP_URI, "foo");
  // await qpub.peek();
  //
  initSubjects();
  await initQueues();
  await startQueueProducers();
  await startQueueConsumers();

  const stories = await getTopStories();
  stories.forEach((s) => storiesSubject.next({ story: s }));

  /*
  const q = new QueueConsumer<Podcast>(
    "foo",
    rabbitmqConnection,
    new JsonSerializer<Podcast>()
  );
  const stream = await q.startConsumingQueue();
  const subscription = stream.subscribe(
    (msg) => {
      console.log("ENVELOP", msg);
      msg.acknowledge();
    },
    (err) => {
      console.warn(`ERRRRRR`, err);
    },
    () => {
      console.log("Stream is closed!");
    }
  );

  return;

  const textsQueue = new MessageQueueService<Podcast>(
    process.env.AMQP_URI,
    "texts"
  );
  const audioQueue = new MessageQueueService<Podcast>(
    process.env.AMQP_URI,
    "audio"
  );

  const podcast = await getStoryText(textsQueue);
  const sentences = splitTextIntoChunks(podcast.text.text);

  podcast.audio = {
    file: join(__dirname, `../stories/${podcast.story.id}/audio.wav`),
    format: "audio/wav",
    length: 1,
  };

  const outputDir = dirname(podcast.audio.file);
  mkdirSync(outputDir, { recursive: true });
  await Promise.all(
    sentences.map((sentence, i) =>
      synthesizeSpeechForSentence(sentence, `${outputDir}/${i}.wav`)
    )
  );

  await combineAudioChunks(
    sentences.map((_, i) => `${outputDir}/${i}.wav`),
    podcast.audio.file
  );

  delete podcast.text.text;
  await audioQueue.enqueue(podcast);
  */
}

(async function () {
  try {
    await main();
    // process.exit(0);
  } catch (e) {
    console.error(` --> An error occured!`, e);
    process.exit(1);
  }
})();
