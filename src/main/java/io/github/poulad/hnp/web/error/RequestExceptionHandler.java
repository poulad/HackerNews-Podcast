package io.github.poulad.hnp.web.error;

import java.util.stream.Collectors;
import javax.validation.ConstraintViolationException;
import lombok.NonNull;
import lombok.val;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@ResponseBody
public class RequestExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(ConstraintViolationException.class)
  @SuppressWarnings("unused") // used by Spring for failing request validations.
  public final ResponseEntity<ErrorResponse> handleConstraintViolation(
      final @NonNull ConstraintViolationException ex,
      final @NonNull WebRequest request) {
    // TODO verify only validation errors are handled here.
    val errors = ex.getConstraintViolations()
        .stream()
        .map(violation -> new ValidationError(violation.getPropertyPath().toString(),
            RequestParameterType.QUERY, violation.getMessage())
        ).collect(Collectors.toUnmodifiableList());

    val error = new ErrorResponse(ErrorCode.INVALID_REQUEST_PARAMETER,
        String.format("Request parameter%s %s not valid.",
            errors.size() > 1 ? "s" : "",
            errors.size() > 1 ? "are" : "is"),
        errors);
    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }
}