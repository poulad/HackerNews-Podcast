package io.github.poulad.hnp.web.controller;

import io.github.poulad.hnp.web.model.DraftEpisodeDto;
import io.github.poulad.hnp.web.model.EpisodeDraftRequestDto;
import io.github.poulad.hnp.web.service.DraftService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

import javax.annotation.Nonnull;
import javax.validation.Valid;

@Log4j2
@Validated
@RestController
@RequestMapping("api/drafts")
@RequiredArgsConstructor
public class DraftsController {

    @Nonnull
    private final DraftService draftService;

    @Async
    @PostMapping(
            value = "",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE}
    )
    public CompletableFuture<Void> create(
            @RequestBody @NonNull @Valid final EpisodeDraftRequestDto episodeDraftRequestDto
    ) {
        return draftService.draftNewEpisodeForStory(episodeDraftRequestDto.getStoryId());
    }

    @Async
    @GetMapping(
            value = "{draftId}",
            produces = {MediaType.APPLICATION_JSON_VALUE}
    )
    public CompletableFuture<DraftEpisodeDto> getById(
            @PathVariable @NonNull final Long draftId
    ) {
        return draftService.getDraftEpisodeById(draftId);
    }
}
