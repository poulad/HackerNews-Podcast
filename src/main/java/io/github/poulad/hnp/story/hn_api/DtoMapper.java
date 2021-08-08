package io.github.poulad.hnp.story.hn_api;

import io.github.poulad.hnp.story.HackerNewsStory;
import java.time.Instant;
import java.util.Date;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DtoMapper {

  @Nonnull
  DtoMapper INSTANCE = Mappers.getMapper(DtoMapper.class);

  @Nullable
  HackerNewsStory itemDtoToHackerNewsStory(@Nullable ItemDto itemDto);

  @Nullable
  default Date timeToTime(@Nullable Long time) {
    return time == null ? null : Date.from(Instant.ofEpochMilli(time));
  }
}