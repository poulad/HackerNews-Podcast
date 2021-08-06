package io.github.poulad.hnp.web.data.repository;

import io.github.poulad.hnp.web.data.entity.DraftEpisode;
import io.github.poulad.hnp.web.data.entity.Episode;
import lombok.NonNull;
import org.springframework.data.repository.CrudRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import javax.annotation.Nonnull;

@Repository
public interface DraftEpisodeRepository extends CrudRepository<DraftEpisode, Long> {

    @Async
    @Nonnull
    CompletableFuture<Optional<AudioContentView>> findByEpisodeId(long episodeId);

    @Async
    @Override
    @Nonnull
    <S extends DraftEpisode> S save(@NonNull S draftEpisode);

}
