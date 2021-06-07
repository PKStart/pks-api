import { UUID } from '@pk-start/common'
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm'

@Entity('shortcuts')
export class ShortcutEntity {
  @ObjectIdColumn()
  _id: string

  @PrimaryColumn()
  id: UUID

  @Column()
  name: string
}
