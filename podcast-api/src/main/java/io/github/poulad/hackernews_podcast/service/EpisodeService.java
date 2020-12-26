package io.github.poulad.hackernews_podcast.service;

import io.github.poulad.hackernews_podcast.model.EpisodeDto;
import org.springframework.scheduling.annotation.Async;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface EpisodeService {
    List<EpisodeDto> getAll();

    @Async
    CompletableFuture<byte[]> getAudioContent(long storyId);
}
