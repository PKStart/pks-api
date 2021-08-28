import { BaseEntity, IdObject, UUID } from './misc'

export interface Link {
  name: string
  url: string
}

export interface Note extends BaseEntity {
  userId: UUID
  text?: string
  links?: Link[]
  archived: boolean
  pinned: boolean
}

export type CreateNoteRequest = Omit<Note, 'createdAt' | 'id' | 'userId'>
export type UpdateNoteRequest = Omit<Note, 'createdAt' | 'userId'>

export type NoteIdResponse = IdObject
export type DeleteNoteRequest = IdObject
