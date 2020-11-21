import { HackerNewsStory } from "./hacker-news-story";
import { CleanText } from "./clean-text";

export interface Podcast {
  story?: HackerNewsStory;
  text?: CleanText;
  audio?: any;
  episode?: any;
}
