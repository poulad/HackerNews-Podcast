package io.github.poulad.hnp.web.data.entity;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity(name = "episode")
public class Episode {

  @Id
  @Nonnull
  @Column(name = "story_id")
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long storyId;

  @Nonnull
  private String title;

  @Nullable
  private String description;

  @Nullable
  @Column(name = "image_url")
  private String imageUrl;

  @Nonnull
  @Column(name = "audio_url")
  private String audioUrl;

  @Nullable
  @Column(name = "audio_content")
  private String audioContent;

  @Nonnull
  @Column(name = "audio_type")
  private String audioType;

  @Column(name = "audio_size")
  private long audioSize;

  private int duration;

  @Nonnull
  @Column(name = "published_at")
  private LocalDateTime publishedAt;
}
