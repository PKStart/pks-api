import { Shortcut, ShortcutCategory } from 'pks-common'

export const shortcut1: Partial<Shortcut> = {
  name: 'Test Shortcut 1',
  url: 'https://www.google.com',
  priority: 1,
  category: ShortcutCategory.GOOGLE,
  iconUrl: 'google.png',
}

export const shortcut2: Partial<Shortcut> = {
  name: 'Test Shortcut 2',
  url: 'https://www.facebook.com',
  priority: 2,
  category: ShortcutCategory.FUN,
  iconUrl: 'facebook.png',
}

export const shortcut3: Partial<Shortcut> = {
  name: 'Other Test Shortcut',
  url: 'https://www.linkedin.com',
  priority: 2,
  category: ShortcutCategory.OTHERS,
  iconUrl: 'linkedin.png',
}
