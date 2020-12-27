package io.github.poulad.hackernews_podcast.model;

import lombok.Data;

@Data
public class AudioDto {
    private String url;
    private long size;
    private String format;
}
