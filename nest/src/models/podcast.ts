import { HackerNewsStory } from './hacker-news-story';
import { CleanText } from './clean-text';
import { Audio } from './audio';

export interface Podcast {
  story?: HackerNewsStory;
  text?: CleanText;
  audio?: Audio;
  episode?: any;
}
