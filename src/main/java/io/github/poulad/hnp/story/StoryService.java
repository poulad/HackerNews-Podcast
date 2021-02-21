package io.github.poulad.hnp.story;

import io.github.poulad.hnp.common.ServiceLayerException;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import javax.annotation.Nonnull;

public interface StoryService {

  @Nonnull
  CompletableFuture<Optional<HackerNewsStory>> getHackerNewsStoryById(long id)
      throws ServiceLayerException;

  @Nonnull
  CompletableFuture<HackerNewsStory> getTopHackerNewsStory(int offset)
      throws ServiceLayerException;
}
