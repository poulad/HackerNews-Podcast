package io.github.poulad.hnp.story.hn_api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.annotation.Nullable;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ItemDto {

  @Nullable
  Long id;

  @Nullable
  String title;

  @Nullable
  String type;

  @Nullable
  String url;

  @Nullable
  String by;

  @Nullable
  Long score;

  @Nullable
  Long time;
}

