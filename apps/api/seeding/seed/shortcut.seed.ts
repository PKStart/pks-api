import { UUID } from '@pk-start/common'
import { getRepository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { ShortcutEntity } from '../../src/shortcuts/shortcut.entity'
import { useSeedData } from '../use-seed-data'

export async function seedShortcuts(userId: UUID): Promise<void> {
  try {
    const { shortcuts } = useSeedData()
    const shortcutRepository = getRepository(ShortcutEntity)
    for (const shortcut of shortcuts) {
      await shortcutRepository.save(
        shortcutRepository.create({
          ...shortcut,
          id: uuid(),
          userId,
          createdAt: new Date(),
        })
      )
    }
  } catch (error) {
    console.log('[Seed] Error seeding Shortcuts:', error)
  }
}
