/** Centralized error middleware */
export function notFoundHandler(_req, res) {
  res.status(404).json({ message: "Route not found" });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  const body = err.expose === true ? { message: err.message } : { message: "Internal server error" };
  res.status(status).json(body);
}

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.expose = true;
  }
}
