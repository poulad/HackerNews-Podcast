package io.github.poulad.hnp.web.error;

import javax.annotation.Nonnull;
import lombok.Value;

@Value
public class ValidationError {

  @Nonnull
  String parameter;

  @Nonnull
  RequestParameterType parameterType;

  @Nonnull
  String errorMessage;
}
