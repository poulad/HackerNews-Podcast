package io.github.poulad.hnp.story.hn_api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ItemDto {

  long id;
  String title;
  String type;
  String url;
  String by;
  long score;
  long time;
}

