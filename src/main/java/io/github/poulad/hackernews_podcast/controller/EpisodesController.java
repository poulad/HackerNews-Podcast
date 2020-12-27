package io.github.poulad.hackernews_podcast.controller;

import io.github.poulad.hackernews_podcast.model.EpisodeDto;
import io.github.poulad.hackernews_podcast.service.EpisodeService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("api/episodes")
public class EpisodesController {
    @Autowired
    private EpisodeService episodeService;

    private static final Logger logger = LogManager.getLogger(EpisodesController.class);

    @Async
    @GetMapping
    public CompletableFuture<ResponseEntity<List<EpisodeDto>>> getEpisodes() {
        return episodeService.getAllEpisodes()
                .thenApply(ResponseEntity::ok)
                .thenApply(resp -> {
                    logger.info("Queried {} episodes.", Objects.requireNonNull(resp.getBody()).size());
                    return resp;
                })
                .exceptionally(exception -> {
                    logger.error("Failed to query all episodes.", exception);
                    return ResponseEntity.status(500).build();
                });
    }

    @Async
    @GetMapping("/{id}/audio.wav")
    public CompletableFuture<ResponseEntity<byte[]>> getEpisodeAudio(
            @PathVariable("id") long storyId
    ) {
        return episodeService.getAudioContent(storyId)
                .thenApply(bytes -> bytes.length > 0
                        ? ResponseEntity.status(200).contentType(MediaType.valueOf("audio/wav")).body(bytes)
                        : ResponseEntity.status(404).body(bytes)
                )
                .exceptionally(exception -> {
                    // TODO log exception
                    return ResponseEntity.status(500).contentLength(0).build();
                });
    }
}
