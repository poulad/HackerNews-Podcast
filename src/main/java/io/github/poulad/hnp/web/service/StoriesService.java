package io.github.poulad.hnp.web.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.poulad.hnp.story.hn_api.ItemDto;
import io.github.poulad.hnp.common.Constants;
import javax.annotation.Nonnull;
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

@Log4j2
@Service
public class StoriesService {

  @Autowired
  @Nonnull
  private RabbitTemplate rabbitTemplate;

  @Autowired
  @Nonnull
  private HttpClient httpClient;

  @Nonnull
  public CompletableFuture<Void> publishTopHackerNewsStories() {
    log.info("Getting top HN stories");

    val request = HttpRequest.newBuilder(
        URI.create("https://hacker-news.firebaseio.com/v0/topstories.json")
    ).build();
    httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
        .thenApply(body -> {
          try {
            return new ObjectMapper().readValue(body.body(), ItemDto.class);
          } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
          }
        });
//                .thenCompose()

    return CompletableFuture.runAsync(
        () -> rabbitTemplate.send(Constants.Queues.STORIES.getName(), null)
    );
  }

}
