import { NoteDto, NoteIdResponseDto } from '../notes/note.dto'
import { PersonalDataDto, PersonalDataIdResponseDto } from '../personal-data/personal-data.dto'
import { BirthdayItemDto, KoreanDictItemDto } from '../proxy/proxy.dto'
import { ShortcutDto, ShortcutIdResponseDto } from '../shortcuts/shortcut.dto'
import {
  LoginResponseDto,
  SignupResponseDto,
  TokenResponseDto,
  UserSettings,
} from '../users/user.dto'
import { CyclingDto } from '../cycling/cycling.dto'

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
    addSettings: {
      operation: { summary: '[Users] Add settings', description: 'Add/update settings of a user' },
      created: { type: UserSettings, description: 'Settings added successfully' },
    },
    delete: {
      operation: {
        summary: '[Users] Delete',
        description: 'Delete a user by the id parsed from the JWT token',
      },
      ok: { description: 'User deleted' },
    },
    backup: {
      operation: {
        summary: '[Users] Data backup',
        description: 'Send a full backup of the user data in email',
      },
      ok: { description: 'Backup email sent successfully' },
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
  personalData: {
    getAll: {
      operation: {
        summary: '[PersonalData] Get all',
        description: 'Get all personal data for a user',
      },
      ok: {
        type: PersonalDataDto,
        isArray: true,
        description: 'An array of Personal Data objects',
      },
    },
    create: {
      operation: {
        summary: '[PersonalData] Create',
        description: 'Create a personal data object',
      },
      created: { type: PersonalDataIdResponseDto, description: 'Personal data object created' },
    },
    update: {
      operation: {
        summary: '[PersonalData] Update',
        description: 'Update a personal data object',
      },
      ok: { type: PersonalDataIdResponseDto, description: 'Personal data object updated' },
    },
    delete: {
      operation: {
        summary: '[PersonalData] Delete',
        description: 'Delete a personal data object',
      },
      ok: { type: PersonalDataIdResponseDto, description: 'Personal data object deleted' },
    },
  },
  proxy: {
    birthdays: {
      operation: {
        summary: '[Proxy] Birthdays',
        description: 'Fetch birthdays from google sheet',
      },
      ok: { type: BirthdayItemDto, isArray: true, description: 'An array of birthday items' },
    },
    korean: {
      operation: {
        summary: '[Proxy] Korean word list',
        description: 'Fetch korean word list from google sheet',
      },
      ok: {
        type: KoreanDictItemDto,
        isArray: true,
        description: 'An array of korean word list entries',
      },
    },
  },
  cycling: {
    get: {
      operation: {
        summary: '[Cycling] Get data for a user',
        description: 'Get all cycling data for a user',
      },
      ok: {
        type: CyclingDto,
        description: 'Cycling data object',
      },
    },
    setWeeklyGoal: {
      operation: {
        summary: '[Cycling] Set weekly goal',
        description: 'Update the weekly goal',
      },
      ok: { type: CyclingDto, description: 'Weekly goal updated' },
    },
    setMonthlyGoal: {
      operation: {
        summary: '[Cycling] Set monthly goal',
        description: 'Update the monthly goal',
      },
      ok: { type: CyclingDto, description: 'Monthly goal updated' },
    },
    chore: {
      create: {
        operation: {
          summary: '[Cycling] Create chore',
          description: 'Create a Cycling chore',
        },
        created: { type: CyclingDto, description: 'Cycling chore created' },
      },
      update: {
        operation: {
          summary: '[Cycling] Update chore',
          description: 'Update a Cycling chore',
        },
        ok: { type: CyclingDto, description: 'Cycling chore updated' },
      },
      delete: {
        operation: {
          summary: '[Cycling] Delete chore',
          description: 'Delete a Cycling chore',
        },
        ok: { type: CyclingDto, description: 'Cycling chore deleted' },
      },
    },
  },
}
