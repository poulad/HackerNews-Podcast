package io.github.poulad.hnp.web.controller;

import io.github.poulad.hnp.story.HackerNewsStory;
import io.github.poulad.hnp.web.ApiResponse;
import io.github.poulad.hnp.web.model.EpisodeDraftRequestDto;
import io.github.poulad.hnp.web.service.DraftService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

import javax.annotation.Nonnull;

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
    public CompletableFuture<ApiResponse<Void>> create(
            @RequestBody EpisodeDraftRequestDto episodeDraftRequestDto
    ) {
        CompletableFuture<HackerNewsStory> fResult;
//        try {
        return draftService.draftNewEpisodeForStory(episodeDraftRequestDto.getStoryId())
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
