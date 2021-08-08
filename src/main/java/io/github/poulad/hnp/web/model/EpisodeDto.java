package io.github.poulad.hnp.web.model;

import java.time.ZonedDateTime;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.Data;

@Data
public class EpisodeDto {

  @Nonnull
  String id;

  @Nonnull
  String title;

  @Nullable
  String description;

  long duration;

  @Nonnull
  AudioDto audio;

  @Nonnull
  ZonedDateTime publishedAt;
}
