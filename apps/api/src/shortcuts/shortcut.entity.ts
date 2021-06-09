import { BaseEntity } from 'src/utils/base.entity'
import { Column, Entity } from 'typeorm'

@Entity('shortcuts')
export class ShortcutEntity extends BaseEntity {
  @Column()
  name: string
}
