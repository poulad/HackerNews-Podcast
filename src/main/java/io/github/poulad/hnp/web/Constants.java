package io.github.poulad.hnp.web;

import javax.annotation.Nonnull;
import lombok.NonNull;

public final class Constants {

  public enum Queues {
    STORIES("stories"),
    TEXTS("texts"),
    AUDIOS("audios"),
    PODCASTS("podcasts"),
    ;

    @Nonnull
    private final String name;

    Queues(@NonNull String name) {
      this.name = name;
    }

    @Nonnull
    public String getName() {
      return this.name;
    }
  }
}
