package io.github.poulad.hnp.web.service;

import io.github.poulad.hnp.web.model.EpisodeDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface EpisodeService {
    CompletableFuture<List<EpisodeDto>> getAllEpisodes();

    CompletableFuture<byte[]> getAudioContent(long storyId);
}
