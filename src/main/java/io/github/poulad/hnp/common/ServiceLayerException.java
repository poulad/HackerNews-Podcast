package io.github.poulad.hnp.common;

import lombok.NonNull;

public class ServiceLayerException extends Exception {

  public ServiceLayerException(@NonNull final String message) {
    super(message);
  }

  public ServiceLayerException(@NonNull final String message, @NonNull final Throwable cause) {
    super(message, cause);
  }

  public ServiceLayerException(@NonNull final Throwable cause) {
    super(cause);
  }
}
