const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // log error for development
  console.log(err);
  const { keyValue } = err;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(keyValue)[0]} value entered`;
    error = new ErrorResponse(message, 400);
  }
  // Moongose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => {
      return value.message;
    });
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
