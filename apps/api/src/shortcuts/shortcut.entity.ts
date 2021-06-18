import { BaseEntity } from 'src/utils/base.entity'
import { Column, Entity } from 'typeorm'
import { Shortcut, ShortcutCategory, UUID } from '@pk-start/common'

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
