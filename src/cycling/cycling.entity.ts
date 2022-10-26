import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../utils'
import { Cycling, CyclingChore, UUID } from 'pks-common'

@Entity('cycling')
export class CyclingEntity extends BaseEntity implements Cycling {
  @Column()
  userId: UUID

  @Column()
  weeklyGoal: number

  @Column()
  monthlyGoal: number

  @Column()
  chores: CyclingChore[]
}
