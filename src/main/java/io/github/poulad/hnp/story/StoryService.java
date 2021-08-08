package io.github.poulad.hnp.story;

import io.github.poulad.hnp.common.ServiceLayerException;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import javax.annotation.Nonnull;
import lombok.NonNull;

public interface StoryService {

  @Nonnull
  CompletableFuture<Optional<HackerNewsStory>> getHackerNewsStoryById(long id)
      throws ServiceLayerException;

  @Nonnull
  CompletableFuture<HackerNewsStory> getTopHackerNewsStory(int offset)
      throws ServiceLayerException;

  @Nonnull
  CompletableFuture<Void> schedulePublishingHackerNewsStory(
      @NonNull HackerNewsStory hackerNewsStory
  ) throws ServiceLayerException;
}
