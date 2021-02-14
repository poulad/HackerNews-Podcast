package io.github.poulad.hnp.web.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.util.Collection;
import lombok.NonNull;
import lombok.Value;

@Value
public class ErrorResponse {

  @NonNull
  public ErrorCode code;

  @JsonInclude(Include.NON_NULL)
  public String message;

  @JsonInclude(Include.NON_EMPTY)
  public Collection<ValidationError> validationErrors;

  @NonNull
  public static ErrorResponse of(@NonNull ErrorCode code) {
    return new ErrorResponse(code, null, null);
  }
}