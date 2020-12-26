package io.github.poulad.hackernews_podcast.service;

import io.github.poulad.hackernews_podcast.model.EpisodeDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface EpisodeService {
    CompletableFuture<List<EpisodeDto>> getAllEpisodes();

    CompletableFuture<byte[]> getAudioContent(long storyId);
}
