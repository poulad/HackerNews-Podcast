package io.github.poulad.hnp.web.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.poulad.hnp.common.Constants;
import io.github.poulad.hnp.story.HackerNewsStory;
import io.github.poulad.hnp.story.hn_api.DtoMapper;
import io.github.poulad.hnp.story.hn_api.ItemDto;
import io.github.poulad.hnp.web.model.EpisodeDto;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import lombok.val;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;

import javax.annotation.Nonnull;

@Log4j2
@Service
@RequiredArgsConstructor
public class DraftService {

    @Nonnull
    private final HttpClient httpClient;

    private final static ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Nonnull
    public CompletableFuture<HackerNewsStory> processStory(final long storyId) {
        log.info("Processing Hacker News story");

        final String storyUrl = String.format("https://hacker-news.firebaseio.com/v0/item/%d.json", storyId);

        val request = HttpRequest.newBuilder(URI.create(storyUrl)).build();
        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenApply(DraftService::convertJsonToItemDto)
                .thenApply(DtoMapper.INSTANCE::itemDtoToHackerNewsStory);
    }


    @Nonnull
    @SneakyThrows
    private static ItemDto convertJsonToItemDto(@NonNull final String json) {
        return OBJECT_MAPPER.readValue(json, ItemDto.class);
    }
}
