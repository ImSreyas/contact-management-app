export const sendSuccess = (res, data = {}, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res,
  error = {},
  message = "Error occurred",
  statusCode = 400
) => {
  return res.status(statusCode).json({
    success: false,
    error,
    message,
  });
};

export class AppError extends Error {
  constructor({ code = "999", error = "Something went wrong" }) {
    super("AppError");
    this.name = "AppError";
    this.code = code;
    this.error = error;

    Error.captureStackTrace(this, this.constructor);
  }
}
