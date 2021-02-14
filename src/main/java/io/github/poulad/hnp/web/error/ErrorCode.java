package io.github.poulad.hnp.web.error;

import lombok.NonNull;

public enum ErrorCode {
  INVALID_REQUEST_PARAMETER("invalid_request_param", 400),
  SERVICE_FAILURE("service_failure", 500),
  ;

  @NonNull
  private final String type;
  private final int httpStatusCode;

  ErrorCode(@NonNull String type, int httpStatusCode) {
    this.type = type;
    this.httpStatusCode = httpStatusCode;
  }

  @NonNull
  public String getType() {
    return type;
  }

  public int getHttpStatusCode() {
    return httpStatusCode;
  }
}
