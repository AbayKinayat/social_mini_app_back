const UserService = require("../services/user-service");

class Controller {
  async registration(req, res, next) {
    // --- Новая Регистрация ---
    try {
      const { firstName, lastName, secondName, email, password, } = req.body;

      const userData = await UserService.registration({ firstName, lastName, secondName, email, password, });
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.status(201).json(userData);
    } catch (e) {
      next(e);
    }
  }

  async auth(req, res, next) {
    try {
      const { login, password } = req.body;

      const userData = await UserService.login(login, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie("refreshToken");

      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}
module.exports = new Controller();
