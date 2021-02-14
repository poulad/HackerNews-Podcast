package io.github.poulad.hnp.web.error;

import lombok.NonNull;

public enum RequestParameterType {
  QUERY("query_string"),
  BODY("request_body"),
  ;

  @NonNull
  private final String type;

  RequestParameterType(@NonNull String type) {
    this.type = type;
  }

  @NonNull
  public String getType() {
    return type;
  }
}
