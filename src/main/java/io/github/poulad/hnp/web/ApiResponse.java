package io.github.poulad.hnp.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.github.poulad.hnp.web.error.ErrorCode;
import io.github.poulad.hnp.web.error.ErrorResponse;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

@AllArgsConstructor
@Getter
public class ApiResponse<TResult> {

  @Nullable
  @JsonInclude(Include.NON_NULL)
  TResult result;

  @Nullable
  @JsonInclude(Include.NON_NULL)
  ErrorResponse error;

  @Nonnull
  public static <T> ApiResponse<T> of(@NonNull T result) {
    return new ApiResponse<>(result, null);
  }

  @Nonnull
  public static <T> ApiResponse<T> error(@NonNull ErrorCode errorCode) {
    return new ApiResponse<>(null, ErrorResponse.of(errorCode));
  }

  @Nonnull
  public static <T> ApiResponse<T> error(@NonNull ErrorCode errorCode, @NonNull String message) {
    return new ApiResponse<>(null, new ErrorResponse(errorCode, message, null));
  }
}
