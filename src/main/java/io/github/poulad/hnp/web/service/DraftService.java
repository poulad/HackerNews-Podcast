package io.github.poulad.hnp.web.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.poulad.hnp.story.HackerNewsStory;
import io.github.poulad.hnp.story.hn_api.DtoMapper;
import io.github.poulad.hnp.story.hn_api.ItemDto;
import io.github.poulad.hnp.web.data.entity.DraftEpisode;
import io.github.poulad.hnp.web.data.entity.EntityMapper;
import io.github.poulad.hnp.web.data.entity.Episode;
import io.github.poulad.hnp.web.data.repository.DraftEpisodeRepository;
import io.github.poulad.hnp.web.data.repository.EpisodeRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import lombok.val;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

import javax.annotation.Nonnull;

@Log4j2
@RequiredArgsConstructor
public class DraftService {

    @Nonnull
    private final EpisodeRepository episodeRepository;

    @Nonnull
    private final DraftEpisodeRepository draftEpisodeRepository;

    @Nonnull
    private final HttpClient httpClient;

    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Nonnull
    public CompletableFuture<Void> draftNewEpisodeForStory(final long storyId) {
        log.info("Processing Hacker News story");

        // TODO: first, ensure there is no episode for this HN story.

        queryHackerNewsStory(storyId)
                .thenCompose(this::createNewUnpublishedEpisode);

        final String storyUrl = String.format("https://hacker-news.firebaseio.com/v0/item/%d.json", storyId);

        val request = HttpRequest.newBuilder(URI.create(storyUrl)).build();
        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(DraftService::convertJsonToItemDto)
                .thenApply(DtoMapper.INSTANCE::itemDtoToHackerNewsStory)
                .thenCompose(this::createNewUnpublishedEpisode)
                .thenAccept(draftEpisode -> log.info("Created new draft episode: " + draftEpisode));
    }

    @Nonnull
    private CompletableFuture<HackerNewsStory> queryHackerNewsStory(final long storyId) {
        final String storyUrl = String.format("https://hacker-news.firebaseio.com/v0/item/%d.json", storyId);

        val request = HttpRequest.newBuilder(URI.create(storyUrl)).build();
        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(DraftService::convertJsonToItemDto)
                .thenApply(DtoMapper.INSTANCE::itemDtoToHackerNewsStory);
    }

    @Nonnull
    private CompletableFuture<DraftEpisode> createNewUnpublishedEpisode(
            @NonNull final HackerNewsStory hackerNewsStory
    ) {
        final Episode episodeEntity = EntityMapper.INSTANCE.hackerNewsStoryToEpisode(hackerNewsStory);

        if (episodeEntity == null) {
            throw new RuntimeException();
        }

        return CompletableFuture.supplyAsync(() -> episodeRepository.save(episodeEntity))
                .thenApply(EntityMapper.INSTANCE::episodeToDraftEpisode)
                .thenCompose(draftEpisode -> CompletableFuture.supplyAsync(() ->
                        draftEpisodeRepository.save(draftEpisode)
                ));
    }

    @Nonnull
    @SneakyThrows
    private static ItemDto convertJsonToItemDto(@NonNull final String json) {
        return OBJECT_MAPPER.readValue(json, ItemDto.class);
    }
}
