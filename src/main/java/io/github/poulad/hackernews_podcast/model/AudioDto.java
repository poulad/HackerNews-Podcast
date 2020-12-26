package io.github.poulad.hackernews_podcast.model;

import io.github.poulad.hackernews_podcast.data.repository.EpisodeView;

public class AudioDto {
    private String url;
    private long size;
    private String format;

    public AudioDto(EpisodeView episode) {
        setUrl(episode.getAudioUrl());
        setSize(episode.getAudioSize());
        setFormat(episode.getAudioType());
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
