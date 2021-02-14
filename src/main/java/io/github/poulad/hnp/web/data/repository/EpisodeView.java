package io.github.poulad.hnp.web.data.repository;

import java.time.LocalDateTime;

public interface EpisodeView {
    long getStoryId();

    String getTitle();

    String getDescription();

    long getDuration();

    String getAudioUrl();

    String getAudioType();

    long getAudioSize();

    LocalDateTime getPublishedAt();
}
