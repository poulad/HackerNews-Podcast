package io.github.poulad.hnp.web.service;

import io.github.poulad.hnp.web.data.repository.EpisodeRepository;
import io.github.poulad.hnp.web.model.EpisodeDto;
import io.github.poulad.hnp.web.model.ModelMapper;
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

    @Autowired
    private ModelMapper modelMapper;

    @Async
    @Override
    public CompletableFuture<List<EpisodeDto>> getAllEpisodes() {
        return episodeRepository.findAllBy()
                .thenApply(episodes -> episodes
                        .parallelStream()
                        .map(modelMapper::episodeViewToDto)
                        .peek(dto -> dto.getAudio()
                                .setUrl(String.format("https://hackernews-podcast.herokuapp.com/api/episodes/%s/audio.wav", dto.getId()))
                        )
                        .collect(Collectors.toUnmodifiableList())
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
