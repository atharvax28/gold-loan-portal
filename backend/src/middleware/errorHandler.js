class ApiError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'NOT_FOUND', message: `No route for ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const body = {
    error: isApiError ? err.code : 'INTERNAL_SERVER_ERROR',
    message: isApiError ? err.message : 'An unexpected error occurred.',
  };
  if (isApiError && err.details) body.details = err.details;
  if (!isApiError) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(statusCode).json(body);
}

module.exports = { ApiError, notFoundHandler, errorHandler };
