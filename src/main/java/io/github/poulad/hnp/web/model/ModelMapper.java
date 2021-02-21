package io.github.poulad.hnp.web.model;

import io.github.poulad.hnp.web.data.repository.EpisodeView;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.NonNull;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Mapper
public interface ModelMapper {

  @Nullable
  @Mappings({
      @Mapping(target = "id", source = "storyId"),
      @Mapping(target = "audio", source = "episodeView"),
  })
  EpisodeDto episodeViewToDto(@Nullable EpisodeView episodeView);

  @Nullable
  @Mappings({
      @Mapping(target = "url", source = "audioUrl"),
      @Mapping(target = "size", source = "audioSize"),
      @Mapping(target = "format", source = "audioType"),
  })
  AudioDto episodeViewToAudioDto(@Nullable EpisodeView episodeView);

  @Nonnull
  default ZonedDateTime map(@NonNull LocalDateTime local) {
    return ZonedDateTime.of(local, ZoneId.of("UTC"));
  }
}