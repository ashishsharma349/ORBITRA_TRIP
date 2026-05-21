const { HTTP_STATUS } = require('./constants');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong';
  
  if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    console.error('ERROR:', err);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode = HTTP_STATUS.BAD_REQUEST;
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    message = `Invalid input: ${messages.join('. ')}`;
    statusCode = HTTP_STATUS.BAD_REQUEST;
  }

  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please log in again.';
    statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Your token has expired. Please log in again.';
    statusCode = HTTP_STATUS.UNAUTHORIZED;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      status: statusCode,
    },
  });
};

module.exports = {
  AppError,
  errorHandler,
};
