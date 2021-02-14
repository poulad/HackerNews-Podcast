package io.github.poulad.hnp.story;

import io.github.poulad.hnp.common.ServiceLayerException;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import lombok.NonNull;

public interface StoryService {

  @NonNull
  CompletableFuture<Optional<HackerNewsStory>> getHackerNewsStoryById(long id)
      throws ServiceLayerException;

  @NonNull
  CompletableFuture<HackerNewsStory> getTopHackerNewsStory(int offset)
      throws ServiceLayerException;
}
