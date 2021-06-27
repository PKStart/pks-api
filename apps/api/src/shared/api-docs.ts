import { NoteDto, NoteIdResponseDto } from '../notes/note.dto'
import { ShortcutDto, ShortcutIdResponseDto } from '../shortcuts/shortcut.dto'
import { LoginResponseDto, SignupResponseDto, TokenResponseDto } from '../users/user.dto'

export const apiDocs = {
  wakeUp: {
    operation: {
      summary: '[WakeUp] Wake Up',
      description: 'Just a dummy request to make sure the API is running',
    },
    ok: { description: 'The API is up and running!' },
  },
  generic: {
    userNotFound: { description: 'User not found' },
    itemNotFound: { description: 'Item(s) not found' },
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
    delete: {
      operation: {
        summary: '[Users] Delete',
        description: 'Delete a user by the id parsed from the JWT token',
      },
      ok: { description: 'User deleted' },
    },
    debugLoginCode: {
      operation: {
        summary: '[Users/Testing] Instant Login Code',
        description: 'Send a login code instantly in the response',
      },
      created: { description: 'Login code is sent' },
    },
  },
  shortcuts: {
    getAll: {
      operation: {
        summary: '[Shortcuts] Get all',
        description: 'Get all shortcuts for a user',
      },
      ok: {
        type: ShortcutDto,
        isArray: true,
        description: 'An array of Shortcuts',
      },
    },
    create: {
      operation: {
        summary: '[Shortcuts] Create',
        description: 'Create a shortcut',
      },
      created: { type: ShortcutIdResponseDto, description: 'Shortcut created' },
    },
    update: {
      operation: {
        summary: '[Shortcuts] Update',
        description: 'Update a shortcut',
      },
      ok: { type: ShortcutIdResponseDto, description: 'Shortcut updated' },
    },
    delete: {
      operation: {
        summary: '[Shortcuts] Delete',
        description: 'Delete a shortcut',
      },
      ok: { type: ShortcutIdResponseDto, description: 'Shortcut deleted' },
    },
  },
  notes: {
    getAll: {
      operation: {
        summary: '[Notes] Get all',
        description: 'Get all notes for a user',
      },
      ok: {
        type: NoteDto,
        isArray: true,
        description: 'An array of Notes',
      },
    },
    create: {
      operation: {
        summary: '[Notes] Create',
        description: 'Create a note',
      },
      created: { type: NoteIdResponseDto, description: 'Shortcut created' },
    },
    update: {
      operation: {
        summary: '[Notes] Update',
        description: 'Update a note',
      },
      ok: { type: NoteIdResponseDto, description: 'Note updated' },
    },
    delete: {
      operation: {
        summary: '[Notes] Delete',
        description: 'Delete a note',
      },
      ok: { type: NoteIdResponseDto, description: 'Note deleted' },
    },
  },
}
