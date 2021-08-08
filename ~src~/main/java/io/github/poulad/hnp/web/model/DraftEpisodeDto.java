package io.github.poulad.hnp.web.model;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public record DraftEpisodeDto(
        @Nonnull String id,
        @Nullable String title,
        @Nullable String description,
        @Nullable AudioDto audio
) {

}
