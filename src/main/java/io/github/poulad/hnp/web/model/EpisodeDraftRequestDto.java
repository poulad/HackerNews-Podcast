package io.github.poulad.hnp.web.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nonnull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EpisodeDraftRequestDto {

    Long storyId;
}
