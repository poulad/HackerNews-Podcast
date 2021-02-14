package io.github.poulad.hnp.web.controller;

import io.github.poulad.hnp.common.ServiceLayerException;
import io.github.poulad.hnp.story.HackerNewsStory;
import io.github.poulad.hnp.story.StoryService;
import io.github.poulad.hnp.web.ApiResponse;
import io.github.poulad.hnp.web.error.ErrorCode;
import io.github.poulad.hnp.web.error.ErrorResponse;
import java.util.concurrent.CompletableFuture;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import lombok.NonNull;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@Validated
@RestController
@RequestMapping("api/stories")
public class StoriesController {

  @Autowired
  StoryService storyService;

  @Async
  @NonNull
  @GetMapping(value = "/_top", produces = {MediaType.APPLICATION_JSON_VALUE})
  public CompletableFuture<ApiResponse<HackerNewsStory>> getTopStory(
      @RequestParam(value = "offset", required = false)
      @Min(value = 1, message = Validations.Messages.offset)
      @Max(value = 10, message = Validations.Messages.offset) final Integer offset,
      // TODO show the top story of specified date
      @RequestParam(value = "date", required = false) final String date
  ) {
    CompletableFuture<HackerNewsStory> fResult;
    try {
      fResult = storyService.getTopHackerNewsStory(offset == null ? 0 : offset);
    } catch (ServiceLayerException e) {
      log.error("Unexpected service failure", e);
      return CompletableFuture.completedFuture(
          new ApiResponse<>(null, ErrorResponse.of(ErrorCode.SERVICE_FAILURE)));
    } catch (Throwable e) {
      log.error("WTH happened there?", e);
      return CompletableFuture.completedFuture(ApiResponse.error(ErrorCode.SERVICE_FAILURE));
    }
    return fResult
        .thenApply(ApiResponse::of)
        .exceptionally(e -> ApiResponse.error(ErrorCode.SERVICE_FAILURE, e.getMessage()));
  }

  public static class Validations {

    public static class Messages {

      public static final String offset = "Offset number for the latest story should be between 1 and 10(inclusive).";
    }
  }
}
