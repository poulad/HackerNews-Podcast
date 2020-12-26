package io.github.poulad.hackernews_podcast.service;

import io.github.poulad.hackernews_podcast.data.repository.EpisodeRepository;
import io.github.poulad.hackernews_podcast.model.EpisodeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class EpisodeServiceImpl implements EpisodeService {
    @Autowired
    private EpisodeRepository episodeRepository;

    @Async
    @Override
    public CompletableFuture<List<EpisodeDto>> getAllEpisodes() {
        return episodeRepository.findAllBy()
                .thenApply(episodes -> episodes
                        .parallelStream()
                        .map(EpisodeDto::new)
                        .peek(dto -> dto.getAudio()
                                .setUrl(String.format("https://hackernews-podcast.herokuapp.com/api/episodes/%s/audio.wav", dto.getId()))
                        )
                        .collect(Collectors.toList())
                );
    }

    @Async
    @Override
    public CompletableFuture<byte[]> getAudioContent(long storyId) {
        return episodeRepository.findByStoryId(storyId)
                .thenApply(contentView -> contentView.isPresent()
                        ? Base64.getDecoder().decode(contentView.get().getAudioContent())
                        : new byte[0]
                );
    }
}
