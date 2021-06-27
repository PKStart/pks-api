import { ShortcutEntity } from '../src/shortcuts/shortcut.entity'
import { UserEntity } from '../src/users/user.entity'

export type EntityRecord = Record<string, any>

export const entities: EntityRecord = {
  users: UserEntity,
  shortcuts: ShortcutEntity,
}
