import { ShortcutCategory } from '../enums'
import { BaseEntity, IdObject, UUID } from './misc'

export interface Shortcut extends BaseEntity {
  userId: UUID
  name: string
  url: string
  iconUrl: string
  category: ShortcutCategory
  priority: number
}

export type CreateShortcutRequest = Omit<Shortcut, 'createdAt' | 'id' | 'userId'>
export type UpdateShortcutRequest = Omit<Shortcut, 'createdAt' | 'userId'>

export type ShortcutIdResponse = IdObject
export type DeleteShortcutRequest = IdObject
