import { Shortcut, ShortcutCategory } from '@pk-start/common'
import { ShortcutsByCategory } from './shortcuts.types'

export function distributeShortcuts(shortcuts: Shortcut[]): ShortcutsByCategory {
  const result: ShortcutsByCategory = {
    [ShortcutCategory.TOP]: [],
    [ShortcutCategory.CODING]: [],
    [ShortcutCategory.GOOGLE]: [],
    [ShortcutCategory.FUN]: [],
    [ShortcutCategory.OTHERS]: [],
  }
  shortcuts.forEach(s => {
    result[s.category].push(s)
  })
  Object.values(result).forEach((list: Shortcut[]) => {
    list.sort((a, b) => a.priority - b.priority)
  })
  return result
}
