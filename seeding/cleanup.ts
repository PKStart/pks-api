import { cleanup } from './seed/db-cleanup'
import { useConnection } from './use-connection'

async function processCleanup(): Promise<void> {
  const { connection } = useConnection()
  await connection.initialize()

  await cleanup(connection, { verbose: true })

  await connection.destroy()
}

processCleanup().then(() => {
  console.log('[CleanUp] Cleanup finished')
})
