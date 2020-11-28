export interface HackerNewsStory {
  by: string;
  id: number;
  score: number;
  time: number;
  title: string;
  type: 'story' | 'job' | 'comment' | 'poll' | 'pollopt';
  url: string;
}
