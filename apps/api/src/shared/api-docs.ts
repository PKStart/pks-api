import { LoginResponseDto, SignupResponseDto, TokenResponseDto } from 'src/users/user.dto'

export const apiDocs = {
  generic: {
    userNotFound: { description: 'User not found' },
    validationError: { description: 'Validation error: request data is invalid' },
    unauthorized: { description: 'User is not authenticated' },
    forbidden: { description: 'User has no access rights to the requested content' },
  },
  users: {
    signup: {
      operation: {
        summary: '[Users] Sign up',
        description: 'Register a user',
      },
      created: {
        type: SignupResponseDto,
        description: 'User is created',
      },
      conflict: {
        description: 'Email is already registered',
      },
    },
    loginCode: {
      operation: {
        summary: '[Users] Login Code',
        description: 'Send a login code for the user in email',
      },
      created: { description: 'Login code is sent' },
    },
    login: {
      operation: { summary: '[Users] Login', description: 'Log in using login code' },
      ok: { type: LoginResponseDto, description: 'Successfully logged in' },
    },
    tokenRefresh: {
      operation: {
        summary: '[Users] Token Refresh',
        description: 'Create a new access token for a user',
      },
      ok: { type: TokenResponseDto, description: 'New token is generated' },
    },
  },
}
