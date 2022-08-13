import { DataSource } from 'typeorm'
import { entities } from '../entity-record'

type CleanUpOptions = { verbose: boolean }
const defaultOptions = { verbose: false }

export async function cleanup(
  dataSource: DataSource,
  { verbose }: CleanUpOptions = defaultOptions
): Promise<void> {
  for (const [name, entity] of Object.entries(entities)) {
    try {
      const repository = await dataSource.getRepository(entity)
      if ((await repository.count()) > 0) {
        await repository.clear()
      }
      verbose && console.log(`[CleanUp] ${name.toUpperCase()} collection has been cleared.`)
    } catch (error) {
      console.log(`[CleanUp] Error during cleanup ${name.toUpperCase()}:`, error)
    }
  }
}
