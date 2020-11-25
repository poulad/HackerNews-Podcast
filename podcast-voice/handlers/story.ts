import * as Axios from "axios";
import { HackerNewsStory } from "../models/hacker-news-story";

export async function getTopStories() {
  let response: Axios.AxiosResponse<number[]>;
  try {
    response = await Axios.default.get(
      `https://hacker-news.firebaseio.com/v0/topstories.json`
    );
  } catch (e) {
    console.warn(e);
  }

  const stories: HackerNewsStory[] = [];

  for (const id of response.data) {
    let itemResponse: Axios.AxiosResponse<HackerNewsStory>;
    try {
      itemResponse = await Axios.default.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
    } catch (e) {
      console.warn(e);
    }
    if (itemResponse.data.type !== "story") {
      continue;
    }
    stories.push(itemResponse.data);
    if (stories.length === 5) {
      break;
    }
  }
  return stories;
}
