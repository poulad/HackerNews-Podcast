package io.github.poulad.hnp.web.error;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.util.Collection;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.NonNull;
import lombok.Value;

@Value
public class ErrorResponse {

  @Nonnull
  public ErrorCode code;

  @JsonInclude(Include.NON_NULL)
  @Nullable
  public String message;

  @Nullable
  @JsonInclude(Include.NON_EMPTY)
  public Collection<ValidationError> validationErrors;

  @Nonnull
  public static ErrorResponse of(@NonNull ErrorCode code) {
    return new ErrorResponse(code, null, null);
  }
}
