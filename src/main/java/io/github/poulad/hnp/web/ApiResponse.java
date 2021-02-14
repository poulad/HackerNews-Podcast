package io.github.poulad.hnp.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import io.github.poulad.hnp.web.error.ErrorCode;
import io.github.poulad.hnp.web.error.ErrorResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

@AllArgsConstructor
@Getter
public class ApiResponse<TResult> {

  @JsonInclude(Include.NON_NULL)
  TResult result;

  @JsonInclude(Include.NON_NULL)
  ErrorResponse error;

  public static <T> ApiResponse<T> of(@NonNull T result) {
    return new ApiResponse<>(result, null);
  }

  public static <T> ApiResponse<T> error(@NonNull ErrorCode errorCode) {
    return new ApiResponse<>(null, ErrorResponse.of(errorCode));
  }

  public static <T> ApiResponse<T> error(@NonNull ErrorCode errorCode, @NonNull String message) {
    return new ApiResponse<>(null, new ErrorResponse(errorCode, message, null));
  }
}
