const jwt = require("jsonwebtoken");
const { tokens } = require("../models");

class TokenService {
  generateUserToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokens.findOne({ where: { user_id: userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokens.create({ user_id: userId, refreshToken });
    return token;
  }

  validateAccessToken(token) {
    try {
      const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return data;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const data = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return data;
    } catch (error) {
      return null;
    }
  }

  async removeToken(refreshToken) {
    const tokenData = await tokens.findOne({ where: { refreshToken } });
    await tokenData.destroy();
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await tokens.findOne({ where: { refreshToken } });
    return tokenData;
  }
}

module.exports = new TokenService();