const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
  hashToken(token) {
    if (!token) return '';
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashed) {
    return await bcrypt.compare(password, hashed);
  }

  generateAccessToken(user) {
    const payload = {
      id: user._id || user.id,
      email: user.email,
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    });
  }

  generateRefreshToken(user) {
    const payload = {
      id: user._id || user.id,
    };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new AuthService();
