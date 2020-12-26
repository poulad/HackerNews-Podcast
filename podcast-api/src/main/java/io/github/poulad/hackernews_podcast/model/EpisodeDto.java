package io.github.poulad.hackernews_podcast.model;

import io.github.poulad.hackernews_podcast.data.repository.EpisodeView;

import java.time.ZoneId;
import java.time.ZonedDateTime;

public class EpisodeDto {
    private String id;

    private String title;

    private String description;

    private long duration;

    private AudioDto audio;

    private ZonedDateTime publishedAt;

    public EpisodeDto(EpisodeView episode) {
        setId(episode.getStoryId() + "");
        setTitle(episode.getTitle());
        setDescription(episode.getDescription());
        setDuration(episode.getDuration());
        setAudio(new AudioDto(episode));
        setPublishedAt(ZonedDateTime.of(episode.getPublishedAt(), ZoneId.of("UTC")));
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getDuration() {
        return duration;
    }

    public void setDuration(long duration) {
        this.duration = duration;
    }

    public AudioDto getAudio() {
        return audio;
    }

    public void setAudio(AudioDto audio) {
        this.audio = audio;
    }

    public ZonedDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(ZonedDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}
