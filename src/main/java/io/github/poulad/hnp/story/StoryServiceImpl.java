package io.github.poulad.hnp.story;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.poulad.hnp.common.Constants.Queues;
import io.github.poulad.hnp.common.ServiceLayerException;
import io.github.poulad.hnp.story.hn_api.ItemDto;
import io.github.poulad.hnp.story.hn_api.DtoMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import javax.annotation.Nonnull;
import lombok.NonNull;
import lombok.SneakyThrows;
import lombok.extern.log4j.Log4j2;
import lombok.val;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class StoryServiceImpl implements StoryService {

  @Autowired
  @Nonnull
  private HttpClient httpClient;

  @Autowired
  @Nonnull
  private RabbitTemplate rabbitTemplate;

  @Nonnull
  @Override
  public CompletableFuture<Optional<HackerNewsStory>> getHackerNewsStoryById(long id) {
    log.debug("Getting HN story {}", id);

    val request = HttpRequest.newBuilder(
        URI.create(String.format("https://hacker-news.firebaseio.com/v0/item/%d.json", id))
    ).build();
    return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
        .thenApply(StoryServiceImpl::parseStoryResponse)
        .thenApply(DtoMapper.INSTANCE::itemDtoToHackerNewsStory)
        .thenApply(Optional::of);
  }

  @Nonnull
  @Override
  public CompletableFuture<HackerNewsStory> getTopHackerNewsStory(int offset)
      throws ServiceLayerException {
    log.info("Getting top HN story");

    val request = HttpRequest.newBuilder(
        URI.create("https://hacker-news.firebaseio.com/v0/topstories.json")
    ).build();
    return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
        .thenApply(StoryServiceImpl::parseTopStoriesResponse)
        .thenApply(arr -> arr[0])
        .thenCompose(this::getHackerNewsStoryById)
        .thenApply(Optional::get)
        ;
  }

  @Nonnull
  @Override
  public CompletableFuture<Void> schedulePublishingHackerNewsStory(
      @NonNull HackerNewsStory hackerNewsStory) throws ServiceLayerException {
    String json;
    try {
      json = new ObjectMapper().writeValueAsString(hackerNewsStory);
    } catch (JsonProcessingException e) {
      log.error("Failed to serialize Hacker News story to JSON.", e);
      throw new ServiceLayerException("Service failed to prepare Hacker News story for publish.",
          e);
    }

    // TODO check for story type

    return CompletableFuture.runAsync(() -> rabbitTemplate.send(
        Queues.STORIES.getName(), new Message(json.getBytes(), new MessageProperties()))
    );
    // TODO catch errors in future exec
  }

  @Nonnull
  @SneakyThrows
  private static ItemDto parseStoryResponse(@NonNull HttpResponse<String> body) {
    try {
      return new ObjectMapper().readValue(body.body(), ItemDto.class);
    } catch (JsonProcessingException e) {
      log.error("Failed to deserialize JSON response.", e);
      throw new ServiceLayerException("Service failed to get top Hacker News stories.", e);
    }
  }

  @Nonnull
  @SneakyThrows
  private static long[] parseTopStoriesResponse(@NonNull HttpResponse<String> body) {
    val bodyContent = body.body();
    log.debug("Parsing Top Stories response body. {}", bodyContent);

    if (body.statusCode() != 200) {
      // TODO handle error responses. check status
      log.warn("Unexpected HTTP response status code {}. body: {}", body.statusCode(), bodyContent);
      return new long[0];
    }

    try {
      return new ObjectMapper().readValue(bodyContent, long[].class);
    } catch (JsonProcessingException e) {
      log.error("Failed to deserialize JSON response.", e);
      throw new ServiceLayerException("Service failed to get top Hacker News stories.", e);
    }
  }
}
