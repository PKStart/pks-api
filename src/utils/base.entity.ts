import { UUID } from 'pks-common'
import { Column, Index, ObjectIdColumn, PrimaryColumn } from 'typeorm'

export class BaseEntity {
  @ObjectIdColumn()
  _id: string

  @PrimaryColumn()
  @Index()
  id: UUID

  @Column()
  createdAt: Date
}
