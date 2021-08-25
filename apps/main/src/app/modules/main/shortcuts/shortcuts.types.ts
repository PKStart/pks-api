import { Shortcut, ShortcutCategory } from '@pk-start/common'

export interface ShortcutsByCategory {
  [ShortcutCategory.TOP]: Shortcut[]
  [ShortcutCategory.CODING]: Shortcut[]
  [ShortcutCategory.GOOGLE]: Shortcut[]
  [ShortcutCategory.FUN]: Shortcut[]
  [ShortcutCategory.OTHERS]: Shortcut[]
}
