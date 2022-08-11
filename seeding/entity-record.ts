import { NoteEntity } from '../src/notes/note.entity'
import { PersonalDataEntity } from '../src/personal-data/personal-data.entity'
import { ShortcutEntity } from '../src/shortcuts/shortcut.entity'
import { UserEntity } from '../src/users/user.entity'

export type EntityRecord = Record<string, any>

export const entities: EntityRecord = {
  users: UserEntity,
  shortcuts: ShortcutEntity,
  notes: NoteEntity,
  personalData: PersonalDataEntity,
}
