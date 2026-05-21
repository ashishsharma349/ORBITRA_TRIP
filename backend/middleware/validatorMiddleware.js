const { z } = require('zod');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const registerSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Please provide a valid email address'),
    password: z.string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters long'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }).email('Please provide a valid email address'),
    password: z.string({
      required_error: 'Password is required',
    }).min(1, 'Please provide password'),
  }),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((err) => err.message).join('. ');
      return next(new AppError(message, HTTP_STATUS.BAD_REQUEST));
    }
    next(error);
  }
};

const validateRegisterInput = validate(registerSchema);
const validateLoginInput = validate(loginSchema);

const validateUploadInput = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', HTTP_STATUS.BAD_REQUEST));
  }
  next();
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateUploadInput,
};
