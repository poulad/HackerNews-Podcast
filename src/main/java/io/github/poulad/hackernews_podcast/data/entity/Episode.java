package io.github.poulad.hackernews_podcast.data.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity(name = "episode")
public class Episode {
    @Id
    @Column(name = "story_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long storyId;

    private String title;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "audio_content")
    private String audioContent;

    @Column(name = "audio_type")
    private String audioType;

    @Column(name = "audio_size")
    private long audioSize;

    private int duration;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;
}
