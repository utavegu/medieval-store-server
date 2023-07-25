export const ERROR_MESSAGES = {
  USER_IS_NOT_REGISTERED: 'Такой пользователь не зарегистрирован!',
  USER_IS_ALREADY_REGISTERED: 'Такой пользователь уже зарегистрирован!',
  ONLY_AVAILABLE_NON_AUTHENTICATED_USERS:
    'Доступно только неаутентифицированным пользователям',
  ONLY_AVAILABLE_AUTHENTICATED_USERS:
    'Доступно только аутентифицированным пользователям',
  INVALID_ID: 'Ошибка ввода ID!',
  DO_NOT_ACCESS_RIGHTS: 'У вас недостаточно прав доступа!',
  IS_NOT_ID: 'Параметр не является ID',
};
export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;
export const JWT = {
  ACCESS_TOKEN_EXPIRES_IN_MINUTES: 1, // 15 должно быть, одна минута - тестовое значение
  REFRESH_TOKEN_EXPIRES_IN_DAYS: 7,
};
