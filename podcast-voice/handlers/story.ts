import Axios, { AxiosResponse } from "axios";
import { HackerNewsStory } from "../models/hacker-news-story";

export const STORY_LIMIT = 2;

export async function getTopStories() {
  let response: AxiosResponse<number[]>;
  try {
    response = await Axios.get(
      `https://hacker-news.firebaseio.com/v0/topstories.json`
    );
  } catch (e) {
    console.warn(e);
  }

  const stories: HackerNewsStory[] = [];

  for (const id of response.data) {
    let itemResponse: AxiosResponse<HackerNewsStory>;
    try {
      itemResponse = await Axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
    } catch (e) {
      console.warn(e);
    }
    if (itemResponse.data.type !== "story") {
      continue;
    }
    stories.push(itemResponse.data);
    if (stories.length === STORY_LIMIT) {
      break;
    }
  }
  return stories;
}
