import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'story_id' })
  storyId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'audio_url' })
  audioUrl: string;

  @Column({ name: 'audio_size' })
  audioSize: number;

  @Column()
  duration: number;

  @Column({ name: 'published_at' })
  pubilshedAt: Date;
}
