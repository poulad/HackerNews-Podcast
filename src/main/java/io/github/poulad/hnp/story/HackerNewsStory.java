package io.github.poulad.hnp.story;

import javax.annotation.Nonnull;
import lombok.Value;

@Value
public class HackerNewsStory {

  long number;

  @Nonnull
  String title;

  @Nonnull
  String type;

  @Nonnull
  String url;

  @Nonnull
  String by;

  long score;

  long time;
}
