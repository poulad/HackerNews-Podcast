package io.github.poulad.hnp.web.data.entity;

import lombok.Data;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity(name = "draft_episode")
public class DraftEpisode {

    @Id
    @Nonnull
    @Column(name = "episode_id")
    private Long episodeId;

    @Nullable
    @Column(name = "title")
    private String title;

    @Nullable
    @Column(name = "description")
    private String description;

    @Nullable
    @Column(name = "image_url")
    private String imageUrl;

    @Nullable
    @Column(name = "audio_id")
    private Long audioId;
}
