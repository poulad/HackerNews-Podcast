package io.github.poulad.hnp.web.data.repository;

import io.github.poulad.hnp.web.data.entity.Episode;

import javax.annotation.Nonnull;

import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Repository
public interface EpisodeRepository extends CrudRepository<Episode, Long> {

//    @Async
//    @Nonnull
//    CompletableFuture<Collection<EpisodeView>> findAllBy();
//
//    @Async
//    @Nonnull
//    CompletableFuture<Optional<AudioContentView>> findByStoryId(long storyId);

    @Async
    @Nonnull
    <S extends Episode> S save(@NonNull S episode);

}
