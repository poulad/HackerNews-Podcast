package io.github.poulad.hnp.story.hn_api;

import io.github.poulad.hnp.story.HackerNewsStory;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DtoMapper {

  @Nonnull
  DtoMapper INSTANCE = Mappers.getMapper(DtoMapper.class);

  @Nullable
  @Mapping(source = "id", target = "number")
  HackerNewsStory itemDtoToHackerNewsStory(@Nullable ItemDto itemDto);
}
