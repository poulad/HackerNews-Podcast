package io.github.poulad.hnp.web.data.repository;

import java.time.LocalDateTime;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public interface EpisodeView {

  long getStoryId();

  @Nonnull
  String getTitle();

  @Nullable
  String getDescription();

  long getDuration();

  @Nonnull
  String getAudioUrl();

  @Nonnull
  String getAudioType();

  long getAudioSize();

  @Nonnull
  LocalDateTime getPublishedAt();
}
