import { User } from 'pks-common'
import { BaseEntity } from '../utils'
import { Column, Entity, Unique } from 'typeorm'
import { UserSettings } from './user.dto'

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

  @Column()
  settings: UserSettings
}
