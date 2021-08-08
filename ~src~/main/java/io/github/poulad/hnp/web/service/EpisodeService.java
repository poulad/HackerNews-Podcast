package io.github.poulad.hnp.web.service;

import io.github.poulad.hnp.web.model.EpisodeDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import javax.annotation.Nonnull;

public interface EpisodeService {

  @Nonnull
  CompletableFuture<List<EpisodeDto>> getAllEpisodes();

  @Nonnull
  CompletableFuture<byte[]> getAudioContent(long storyId);
}
