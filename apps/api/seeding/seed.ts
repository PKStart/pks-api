import { cleanup } from './seed/db-cleanup'
import { seedShortcuts } from './seed/shortcut.seed'
import { seedUser } from './seed/user.seed'
import { useConnection } from './use-connection'

async function seed(): Promise<void> {
  const { connection } = useConnection()
  await connection.connect()

  await cleanup({ verbose: true })

  const { userId } = await seedUser()
  console.log('[Seed] Seeded USERS.')

  await seedShortcuts(userId)
  console.log('[Seed] Seeded SHORTCUTS.')

  await connection.close()
}

seed().then(() => {
  console.log('[Seed] Seeding finished.')
})
