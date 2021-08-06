package io.github.poulad.hnp.web.service;

import io.github.poulad.hnp.web.data.repository.EpisodeRepository;
import io.github.poulad.hnp.web.model.EpisodeDto;
import io.github.poulad.hnp.web.model.ModelMapper;

import java.util.Objects;

import javax.annotation.Nonnull;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DefaultEpisodeService implements EpisodeService {

    @Nonnull
    private final EpisodeRepository episodeRepository;

    @Nonnull
    private final ModelMapper modelMapper;

    @Async
    @Nonnull
    @Override
    public CompletableFuture<List<EpisodeDto>> getAllEpisodes() {
        return episodeRepository.findAllBy()
                .thenApply(episodes -> episodes
                        .parallelStream()
                        .map(modelMapper::episodeViewToDto)
                        .filter(Objects::nonNull)
                        .peek(dto -> dto.getAudio()
                                .setUrl(String
                                        .format("https://hackernews-podcast.herokuapp.com/api/episodes/%s/audio.wav",
                                                dto.getId()))
                        ).toList()
                );
    }

    @Async
    @Nonnull
    @Override
    public CompletableFuture<byte[]> getAudioContent(long storyId) {
        return episodeRepository.findByStoryId(storyId)
                .thenApply(contentView -> contentView.isPresent()
                        ? Base64.getDecoder().decode(contentView.get().getAudioContent())
                        : new byte[0]
                );
    }
}
