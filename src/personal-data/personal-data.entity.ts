import { PersonalData, UUID } from 'pks-common'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../utils'

@Entity('personal-data')
export class PersonalDataEntity extends BaseEntity implements PersonalData {
  @Column()
  userId: UUID

  @Column()
  name: string

  @Column()
  identifier: string

  @Column()
  expiry: Date
}
