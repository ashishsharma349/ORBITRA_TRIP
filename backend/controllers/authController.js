const userRepository = require('../repositories/userRepository');
const authService = require('../services/authService');
const { AppError } = require('../utils/errorHandler');
const { HTTP_STATUS, COOKIE_OPTIONS } = require('../utils/constants');

class AuthController {
  signup = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return next(new AppError('Email is already registered', HTTP_STATUS.BAD_REQUEST));
      }

      const hashedPassword = await authService.hashPassword(password);
      const user = await userRepository.create({
        email,
        password: hashedPassword,
      });

      const accessToken = authService.generateAccessToken(user);
      const refreshToken = authService.generateRefreshToken(user);

      await userRepository.addRefreshToken(user._id, authService.hashToken(refreshToken));

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Registration successful',
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findByEmail(email);
      if (!user) {
        return next(new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED));
      }

      const isCorrectPassword = await authService.comparePassword(password, user.password);
      if (!isCorrectPassword) {
        return next(new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED));
      }

      const accessToken = authService.generateAccessToken(user);
      const refreshToken = authService.generateRefreshToken(user);

      await userRepository.addRefreshToken(user._id, authService.hashToken(refreshToken));

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Login successful',
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return next(new AppError('Access Denied. No refresh token provided.', HTTP_STATUS.UNAUTHORIZED));
      }

      const decoded = authService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return next(new AppError('Session expired. Please log in again.', HTTP_STATUS.UNAUTHORIZED));
      }

      const user = await userRepository.findById(decoded.id);
      if (!user) {
        return next(new AppError('User not found.', HTTP_STATUS.UNAUTHORIZED));
      }

      const hashedToken = authService.hashToken(refreshToken);
      if (!user.refreshTokens.includes(hashedToken)) {
        await userRepository.update(user._id, { refreshTokens: [] });
        res.clearCookie('refreshToken', COOKIE_OPTIONS);
        return next(new AppError('Compromised session. Please log in again.', HTTP_STATUS.FORBIDDEN));
      }

      const newAccessToken = authService.generateAccessToken(user);
      const newRefreshToken = authService.generateRefreshToken(user);

      await userRepository.replaceRefreshToken(user._id, hashedToken, authService.hashToken(newRefreshToken));

      res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        const decoded = authService.verifyRefreshToken(refreshToken);
        if (decoded) {
          await userRepository.removeRefreshToken(decoded.id, authService.hashToken(refreshToken));
        }
      }

      res.clearCookie('refreshToken', COOKIE_OPTIONS);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
