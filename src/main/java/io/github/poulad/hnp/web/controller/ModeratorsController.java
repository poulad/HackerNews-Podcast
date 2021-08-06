package io.github.poulad.hnp.web.controller;

import io.github.poulad.hnp.common.ServiceLayerException;
import io.github.poulad.hnp.story.HackerNewsStory;
import io.github.poulad.hnp.story.StoryService;
import io.github.poulad.hnp.web.ApiResponse;
import io.github.poulad.hnp.web.error.ErrorCode;
import io.github.poulad.hnp.web.error.ErrorResponse;
import io.github.poulad.hnp.web.model.EpisodeDraftRequestDto;
import io.github.poulad.hnp.web.service.DraftService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

@Log4j2
@Validated
@RestController
@RequestMapping("api/moderators")
@RequiredArgsConstructor
public class ModeratorsController {

    @Nonnull
    private final DraftService draftService;

    @Async
    @Nonnull
    @PostMapping(value = "/draft-episode", produces = {MediaType.APPLICATION_JSON_VALUE})
    public CompletableFuture<ApiResponse<HackerNewsStory>> create(
            @RequestBody EpisodeDraftRequestDto episodeDraftRequestDto
    ) {
        CompletableFuture<HackerNewsStory> fResult;
//        try {
        return draftService.processStory(episodeDraftRequestDto.getStoryId())
                .thenApply(ApiResponse::of);
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
    }
}
