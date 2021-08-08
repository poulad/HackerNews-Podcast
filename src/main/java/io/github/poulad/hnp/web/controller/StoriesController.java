//package io.github.poulad.hnp.web.controller;
//
//import io.github.poulad.hnp.common.ServiceLayerException;
//import io.github.poulad.hnp.story.HackerNewsStory;
//import io.github.poulad.hnp.story.StoryService;
//import io.github.poulad.hnp.web.ApiResponse;
//import io.github.poulad.hnp.web.error.ErrorCode;
//import io.github.poulad.hnp.web.error.ErrorResponse;
//
//import java.util.Optional;
//import java.util.concurrent.CompletableFuture;
//
//import javax.annotation.Nonnull;
//import javax.annotation.Nullable;
//import javax.validation.constraints.Max;
//import javax.validation.constraints.Min;
//
//import lombok.NonNull;
//import lombok.extern.log4j.Log4j2;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.MediaType;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.validation.annotation.Validated;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@Log4j2
//@Validated
//@RestController
//@RequestMapping("api/stories")
//public class StoriesController {
//
//    @Nonnull
//    @Autowired
//    StoryService storyService;
//
//    @Async
//    @Nonnull
//    @GetMapping(value = "/_top", produces = {MediaType.APPLICATION_JSON_VALUE})
//    public CompletableFuture<ApiResponse<HackerNewsStory>> getTopStory(
//            @RequestParam(value = "offset", required = false)
//            @Min(value = 1, message = Validations.Messages.offset)
//            @Max(value = 10, message = Validations.Messages.offset) final Integer offset,
//            // TODO show the top story of specified date
//            @RequestParam(value = "date", required = false)
//            @Nullable final String date
//    ) {
//        CompletableFuture<HackerNewsStory> fResult;
//        try {
//            fResult = storyService.getTopHackerNewsStory(offset == null ? 0 : offset);
//        } catch (ServiceLayerException e) {
//            log.error("Unexpected service failure", e);
//            return CompletableFuture.completedFuture(
//                    new ApiResponse<>(null, ErrorResponse.of(ErrorCode.SERVICE_FAILURE)));
//        } catch (Throwable e) {
//            log.error("WTH happened there?", e);
//            return CompletableFuture.completedFuture(ApiResponse.error(ErrorCode.SERVICE_FAILURE));
//        }
//        return fResult
//                .thenApply(ApiResponse::of)
//                .exceptionally(e -> ApiResponse.error(ErrorCode.SERVICE_FAILURE, e.getMessage()));
//    }
//
//    @Async
//    @Nonnull
//    @GetMapping(value = "{story_id}/_publish", produces = {MediaType.APPLICATION_JSON_VALUE})
//    public CompletableFuture<ApiResponse<HackerNewsStory>> publishStory(
//            @PathVariable("story_id")
//            @NonNull final Long storyId
//    ) {
//        CompletableFuture<Optional<HackerNewsStory>> fGetStory;
//        try {
//            fGetStory = storyService.getHackerNewsStoryById(storyId);
//        } catch (ServiceLayerException e) {
//            log.error("Unexpected service failure", e);
//            return CompletableFuture.completedFuture(
//                    new ApiResponse<>(null, ErrorResponse.of(ErrorCode.SERVICE_FAILURE)));
//        } catch (Throwable e) {
//            log.error("WTH happened there?", e);
//            return CompletableFuture.completedFuture(ApiResponse.error(ErrorCode.SERVICE_FAILURE));
//        }
//
//        CompletableFuture<ApiResponse<HackerNewsStory>> fScheduleForPublish = fGetStory
//                .thenCompose(oStory ->
//                        oStory.isPresent()
//                                ? scheduleForPublish(oStory.get()).thenApply(__ -> ApiResponse.of(oStory.get()))
//                                : CompletableFuture.completedFuture(
//                                        ApiResponse.error(ErrorCode.RESOURCE_NOT_FOUND, "Story not found")
//                                )
//                );
//
//        return fScheduleForPublish.exceptionally(e -> {
//            log.error("WTH happened there?", e);
//            return ApiResponse.error(ErrorCode.SERVICE_FAILURE, e.getMessage());
//        });
//    }
//
//    @Nonnull
//    private CompletableFuture<Void> scheduleForPublish(@NonNull HackerNewsStory story) {
//        try {
//            return storyService.schedulePublishingHackerNewsStory(story);
//        } catch (Throwable e) {
//            return CompletableFuture.failedFuture(e);
//        }
//    }
//
//    public static class Validations {
//
//        public static class Messages {
//
//            public static final String offset = "Offset number for the latest story should be between 1 and 10(inclusive).";
//        }
//    }
//}
