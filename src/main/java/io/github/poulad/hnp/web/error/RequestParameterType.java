package io.github.poulad.hnp.web.error;

import javax.annotation.Nonnull;
import lombok.NonNull;

public enum RequestParameterType {
  QUERY("query_string"),
  BODY("request_body"),
  ;

  @Nonnull
  private final String type;

  RequestParameterType(@NonNull String type) {
    this.type = type;
  }

  @Nonnull
  public String getType() {
    return type;
  }
}
