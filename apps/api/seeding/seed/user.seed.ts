import { UUID } from '@pk-start/common'
import { getRepository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { UserEntity } from '../../src/users/user.entity'
import { useSeedData } from '../use-seed-data'

export async function seedUser(): Promise<{ userId: UUID }> {
  try {
    const { users } = useSeedData()
    const userRepository = getRepository(UserEntity)
    const userId = uuid()
    await userRepository.save(
      userRepository.create({
        ...users[0],
        id: userId,
        createdAt: new Date(),
      })
    )
    return { userId }
  } catch (error) {
    console.log('[Seed] Error seeding Users:', error)
  }
}
