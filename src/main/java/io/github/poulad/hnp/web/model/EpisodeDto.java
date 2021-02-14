package io.github.poulad.hnp.web.model;

import lombok.Data;
import lombok.NonNull;

import java.time.ZonedDateTime;

@Data
public class EpisodeDto {
    @NonNull
    String id;

    @NonNull
    String title;

    String description;

    long duration;

    AudioDto audio;

    ZonedDateTime publishedAt;
}
