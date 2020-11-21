import dotenv from "dotenv";
import Axios from "axios";
import { mkdirSync, writeFileSync } from "fs";
import { MessageQueueService } from "./services/message-queue-service.js";
import { HackerNewsStory } from "./models/hacker-news-story.js";
import { CleanText } from "./models/clean-text.js";

/**
 * @param {MessageQueueService} mqService
 * @returns {Promise<HackerNewsStory[]>}
 */
async function getLatestStories(mqService) {
  return Promise.resolve([
    // new NewsPost(
    //   "https://observablehq.com/@observablehq/why-were-building-observable"
    // ),
    // new HackerNewsStory(
    //   "https://developers.redhat.com/blog/2020/11/19/transitioning-from-docker-to-podman/"
    // ),
    new HackerNewsStory(
      "https://phys.org/news/2020-11-field-geology-mars-equator-ancient.html"
    ),
  ]);
}

/**
 *
 * @param {string} url
 * @returns {Promise<CleanText>}
 */
async function extractTextFromArticle(url) {
  // TODO handle rate limits. see https://extractarticletext.com/docs/#section/Overview/API-Key
  const apikey = `${process.env.EXTRACTOR_API_KEY}`;
  try {
    const resp = await Axios.get("extractor", {
      baseURL: "https://extractorapi.com/api/v1",
      params: { apikey, url },
    });
    if (resp.status === 200) {
      return resp.data;
    } else {
      throw new Error(
        `Error ${resp.status} ${resp.statusText} ${JSON.parse(resp.data)}`
      );
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * @param {MessageQueueService} mqService
 * @param {any} storyText
 * @returns {Promise<boolean | Error>}
 */
async function enqueueStoryTexts(mqService, storyText) {
  mkdirSync(`texts`);
  writeFileSync(`texts/${storyText.story.id}.json`, JSON.stringify(storyText));
  try {
    await mqService.enqueue(storyText);
  } catch (e) {
    return e;
  }
  return true;
}

async function main() {
  const dotenvResult = dotenv.config();
  if (dotenvResult.error) {
    throw new Error(dotenvResult.error);
  }

  const storiesQueueService = new MessageQueueService(
    process.env.AMQP_URL,
    "stories"
  );
  const textsQueueService = new MessageQueueService(
    process.env.AMQP_URL,
    "texts"
  );
  const stories = await getLatestStories();
  // await storiesQueueService.enqueue(stories[0]);
  const message = await storiesQueueService.peek();

  const processingPromises = await getLatestStories(storiesQueueService).then(
    (stories) =>
      stories.map((story) =>
        extractTextFromArticle(story.url)
          .then((text) => ({ story, text }))
          .then((storyText) =>
            enqueueStoryTexts(textsQueueService, storyText).then((result) => ({
              ...storyText,
              result,
            }))
          )
      )
  );

  for await (const p of processingPromises) {
    console.log(JSON.stringify(p));
  }
}

(async function () {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
