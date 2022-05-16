const { user } = require("../models");
const bcrypt = require("bcrypt");
const TokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-errors");
class UserService {
  async registration({ firstName, lastName, secondName, email, password }) {
    const candidateEmail = await user.findOne({ where: { email } });

    if (candidateEmail) {
      throw ApiError.BadRequest(`Пользователь с таким почтовым адресом ${email} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const interfaceUser = {
      firstName,
      lastName,
      secondName,
      email,
      password: hashPassword,
    };

    const user = await user.create(interfaceUser);
    const userDto = new UserDto(user);

    const tokens = TokenService.generateUserToken({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    }
  }

  async login(email, password) {
    const user = await user.findOne({
      where: { email },
    });
    if (!user) {
      throw ApiError.BadRequest(`Неверный пароль или почта`);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль или логин`);
    }

    const userDto = new UserDto(user); // email role id ... // * WITHOUT PASSWORD
    const tokens = TokenService.generateUserToken({ ...userDto }); // Generate token 

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    }
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await user.findOne({
      where: { id: userData.id },
    })
    const userDto = new UserDto(user); // id, email, name, isActivated
    const tokens = TokenService.generateUserToken({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();