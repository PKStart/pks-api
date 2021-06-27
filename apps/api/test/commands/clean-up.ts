import { getRepository } from 'typeorm'
import { ShortcutEntity } from '../../src/shortcuts/shortcut.entity'
import { UserEntity } from '../../src/users/user.entity'

type CleanUpOptions = { verbose: boolean }
const defaultOptions = { verbose: false }

export async function cleanUpDb({ verbose }: CleanUpOptions = defaultOptions): Promise<void> {
  const entities = { users: UserEntity, shortcuts: ShortcutEntity }
  for (const [name, entity] of Object.entries(entities)) {
    try {
      await getRepository(entity).clear()
      verbose && console.log(`[CleanUp] ${name} collection has been cleared.`)
    } catch (error) {
      console.error(`[CleanUp] Error during cleanup ${name}:`, error)
    }
  }
}
