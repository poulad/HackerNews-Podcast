package io.github.poulad.hnp.web.data.entity;

import io.github.poulad.hnp.story.HackerNewsStory;
import io.github.poulad.hnp.story.hn_api.ItemDto;
import io.github.poulad.hnp.web.model.DraftEpisodeDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.time.Instant;
import java.util.Date;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

@Mapper
public interface EntityMapper {

    @Nonnull
    EntityMapper INSTANCE = Mappers.getMapper(EntityMapper.class);

    @Nullable
    @Mapping(source = "id", target = "storyId")
    Episode hackerNewsStoryToEpisode(@Nullable HackerNewsStory hackerNewsStory);

    @Nullable
    @Mapping(source = "id", target = "episodeId")
    DraftEpisode episodeToDraftEpisode(@Nullable Episode episode);

    @Nullable
    @Mapping(source = "episodeId", target = "id")
    DraftEpisodeDto draftEpisodeToDraftEpisodeDto(@Nullable DraftEpisode draftEpisode);

}
