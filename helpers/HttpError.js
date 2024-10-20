const statusErrorMessages = {
  400: "Bad request",
  401: "Unauthrorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
  500: "Internal server error",
};

const HttpError = (status, message = statusErrorMessages[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = HttpError;
