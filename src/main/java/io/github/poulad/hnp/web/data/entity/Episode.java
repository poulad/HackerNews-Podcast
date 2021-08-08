package io.github.poulad.hnp.web.data.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@NoArgsConstructor
@Entity(name = "episode")
public class Episode {

    @Id
    @Nonnull
    private Long id;

    @Nonnull
    @Column(name = "story_id")
    private Long storyId;

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
    private Integer audioId;

    @Nullable
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}
