package io.github.poulad.hnp.web.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nonnull;
import javax.validation.Valid;
import javax.validation.constraints.Positive;

@Data
@Valid
@NoArgsConstructor
public final class EpisodeDraftRequestDto {

    @Nonnull
    @Positive
    public Long storyId;
}
