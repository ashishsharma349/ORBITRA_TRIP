const User = require('../models/User');

class UserRepository {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async addRefreshToken(userId, token) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { refreshTokens: token } },
      { new: true }
    );
  }

  async removeRefreshToken(userId, token) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { refreshTokens: token } },
      { new: true }
    );
  }

  async replaceRefreshToken(userId, oldToken, newToken) {
    return await User.findOneAndUpdate(
      { _id: userId, refreshTokens: oldToken },
      { 
        $pull: { refreshTokens: oldToken },
        $push: { refreshTokens: newToken }
      },
      { new: true }
    );
  }
}

module.exports = new UserRepository();
