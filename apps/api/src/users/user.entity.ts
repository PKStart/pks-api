import { User } from '@pk-start/common'
import { BaseEntity } from '../utils/base.entity'
import { Column, Entity, Unique } from 'typeorm'

@Entity('users')
@Unique(['email'])
export class UserEntity extends BaseEntity implements User {
  @Column()
  name: string

  @Column()
  email: string

  @Column()
  loginCode?: string

  @Column()
  loginCodeExpires?: Date

  @Column()
  salt?: string
}
