package io.github.poulad.hnp.story.hn_api;

import io.github.poulad.hnp.story.HackerNewsStory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DtoMapper {

  DtoMapper INSTANCE = Mappers.getMapper(DtoMapper.class);

  @Mapping(source = "id", target = "number")
  HackerNewsStory itemDtoToHackerNewsStory(ItemDto itemDto);
}
