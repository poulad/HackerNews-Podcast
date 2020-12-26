package io.github.poulad.hackernews_podcast.data.repository;

import io.github.poulad.hackernews_podcast.data.entity.Episode;
import org.springframework.data.repository.CrudRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Repository
public interface EpisodeRepository extends CrudRepository<Episode, Long> {
    @Async
    CompletableFuture<Collection<EpisodeView>> findAllBy();

    @Async
    CompletableFuture<Optional<AudioContentView>> findByStoryId(long storyId);
}
