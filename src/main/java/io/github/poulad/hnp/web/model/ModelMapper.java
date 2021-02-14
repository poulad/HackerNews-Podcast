package io.github.poulad.hnp.web.model;

import io.github.poulad.hnp.web.data.repository.EpisodeView;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Mapper
public interface ModelMapper {
    @Mappings({
            @Mapping(target = "id", source = "storyId"),
            @Mapping(target = "audio", source = "episodeView"),
    })
    EpisodeDto episodeViewToDto(EpisodeView episodeView);

    @Mappings({
            @Mapping(target = "url", source = "audioUrl"),
            @Mapping(target = "size", source = "audioSize"),
            @Mapping(target = "format", source = "audioType"),
    })
    AudioDto episodeViewToAudioDto(EpisodeView episodeView);

    default ZonedDateTime map(LocalDateTime local) {
        return ZonedDateTime.of(local, ZoneId.of("UTC"));
    }
}