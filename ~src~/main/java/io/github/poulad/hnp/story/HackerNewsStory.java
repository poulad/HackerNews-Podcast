package io.github.poulad.hnp.story;

import java.util.Date;
import javax.annotation.Nonnull;
import lombok.Value;

@Value
public class HackerNewsStory {

  @Nonnull
  Long id;

  @Nonnull
  String title;

  @Nonnull
  HackerNewsStoryType type;

  @Nonnull
  String url;

  @Nonnull
  String by;

  @Nonnull
  Long score;

  /**
   * Publish time in UTC timezone.
   */
  @Nonnull
  Date time;
}
