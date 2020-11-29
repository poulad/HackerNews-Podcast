import { AudioDto } from './audio.dto';

export interface EpisodeDto {
  id: string;
  title: string;
  description: string;
  duration: number;
  audio: AudioDto;
}
