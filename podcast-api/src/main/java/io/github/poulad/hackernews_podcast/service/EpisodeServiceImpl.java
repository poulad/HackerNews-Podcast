package io.github.poulad.hackernews_podcast.service;

import io.github.poulad.hackernews_podcast.data.repository.EpisodeRepository;
import io.github.poulad.hackernews_podcast.model.EpisodeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class EpisodeServiceImpl implements EpisodeService {
    @Autowired
    private EpisodeRepository episodeRepository;

    @Override
    public List<EpisodeDto> getAll() {
        List<EpisodeDto> episodes;

        try {
            var ret = episodeRepository.findAllBy();
            episodes = ret.stream()
                    .map(EpisodeDto::new)
                    .peek(dto -> dto.getAudio().setUrl(String.format("https://hackernews-podcast.herokuapp.com/api/episodes/%s/audio.wav", dto.getId())))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            episodes = Collections.emptyList();
        }
        return episodes;
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
