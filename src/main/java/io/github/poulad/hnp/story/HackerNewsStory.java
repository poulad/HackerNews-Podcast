package io.github.poulad.hnp.story;

import lombok.Value;

@Value
public class HackerNewsStory {

  long number;
  String title;
  String type;
  String url;
  String by;
  long score;
  long time;
}
