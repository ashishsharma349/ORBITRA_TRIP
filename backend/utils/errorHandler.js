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
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  if (err.statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    console.error('ERROR 💥', err);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new AppError(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, HTTP_STATUS.BAD_REQUEST);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el) => el.message);
    err = new AppError(`Invalid input: ${messages.join('. ')}`, HTTP_STATUS.BAD_REQUEST);
  }

  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    err = new AppError('Your token has expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED);
  }

  res.status(err.statusCode).json({
    success: false,
    error: {
      message: err.message || 'Something went wrong',
      status: err.statusCode,
    },
  });
};

module.exports = {
  AppError,
  errorHandler,
};
