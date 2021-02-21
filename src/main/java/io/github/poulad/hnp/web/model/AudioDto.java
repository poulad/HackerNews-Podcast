package io.github.poulad.hnp.web.model;

import javax.annotation.Nonnull;
import lombok.Data;

@Data
public class AudioDto {

  @Nonnull
  private String url;

  private long size;

  @Nonnull
  private String format;
}
