package io.github.poulad.hackernews_podcast.controller;

import io.github.poulad.hackernews_podcast.model.EpisodeDto;
import io.github.poulad.hackernews_podcast.service.EpisodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
public class EpisodesController {
    @Autowired
    private EpisodeService episodeService;

    @GetMapping("api/episodes")
    public ResponseEntity<Iterable<EpisodeDto>> getEpisodes() {
        var res = episodeService.getAll();
        return ResponseEntity.ok(res);
    }

    @Async
    @GetMapping("api/episodes/{id}/audio.wav")
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
