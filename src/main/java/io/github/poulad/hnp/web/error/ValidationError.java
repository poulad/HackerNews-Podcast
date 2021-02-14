package io.github.poulad.hnp.web.error;

import lombok.NonNull;
import lombok.Value;

@Value
public class ValidationError {

  @NonNull
  String parameter;

  @NonNull
  RequestParameterType parameterType;

  @NonNull
  String errorMessage;
}
