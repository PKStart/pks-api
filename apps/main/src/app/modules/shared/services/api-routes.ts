export enum ApiRoutes {
  USERS = '/users',
  USERS_SIGNUP = '/users/signup',
  USERS_LOGIN_CODE = '/users/login-code',
  USERS_LOGIN = '/users/login',
  USERS_TOKEN_REFRESH = '/users/token-refresh',
  SHORTCUTS = '/shortcuts',
  NOTES = '/notes',
  PERSONAL_DATA = '/personal-data',
}

export const publicApiRoutes = [
  ApiRoutes.USERS_SIGNUP,
  ApiRoutes.USERS_LOGIN_CODE,
  ApiRoutes.USERS_LOGIN,
]

export const authenticatedApiRoutes = [
  ApiRoutes.USERS,
  ApiRoutes.USERS_TOKEN_REFRESH,
  ApiRoutes.SHORTCUTS,
  ApiRoutes.NOTES,
  ApiRoutes.PERSONAL_DATA,
]
