import { Link, Note, UUID } from '@pk-start/common'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../utils'

@Entity('notes')
export class NoteEntity extends BaseEntity implements Note {
  @Column()
  userId: UUID

  @Column()
  text?: string

  @Column()
  links?: Link[]

  @Column()
  archived: boolean

  @Column()
  pinned: boolean
}
