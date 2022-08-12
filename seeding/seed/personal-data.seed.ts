import { UUID } from 'pks-common'
import { DataSource } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { PersonalDataEntity } from '../../src/personal-data/personal-data.entity'
import { useSeedData } from '../use-seed-data'

export async function seedPersonalData(dataSource: DataSource, userId: UUID): Promise<void> {
  try {
    const { personalData } = useSeedData()
    const noteRepository = dataSource.getRepository(PersonalDataEntity)
    for (const data of personalData) {
      await noteRepository.save(
        noteRepository.create({
          ...data,
          id: uuid(),
          userId,
          createdAt: new Date(),
        })
      )
    }
  } catch (error) {
    console.log('[Seed] Error seeding Personal Data:', error)
  }
}
