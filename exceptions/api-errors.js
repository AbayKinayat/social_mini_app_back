module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() { // Ошибка авторизации
    return new ApiError(401, 'Пользователь не авторизован');
  }

  static ForbiddenError() { // Ошиюка доступа
    return new ApiError(403, 'Доступ запрещен');
  }

  static BadRequest(message, errors = []) { // Плохой запрос
    return new ApiError(400, message, errors);
  }

  static NotFound(message = "Не найден") { // Ошибка не найдено
    return new ApiError(404, message);
  }

}