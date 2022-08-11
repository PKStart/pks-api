import { BaseEntity } from '../utils'
import { Column, Entity } from 'typeorm'
import { Shortcut, ShortcutCategory, UUID } from 'pks-common'

@Entity('shortcuts')
export class ShortcutEntity extends BaseEntity implements Shortcut {
  @Column()
  userId: UUID

  @Column()
  name: string

  @Column()
  category: ShortcutCategory

  @Column()
  iconUrl: string

  @Column()
  priority: number

  @Column()
  url: string
}
