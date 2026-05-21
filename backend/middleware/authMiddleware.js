const authService = require('../services/authService');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError(
          'You are not logged in. Please log in to get access.',
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    const decoded = authService.verifyAccessToken(token);
    if (!decoded) {
      return next(
        new AppError(
          'Invalid or expired token. Please log in again.',
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
