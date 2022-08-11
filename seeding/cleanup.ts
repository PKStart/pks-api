import { cleanup } from './seed/db-cleanup'
import { useConnection } from './use-connection'

async function processCleanup(): Promise<void> {
  const { connection } = useConnection()
  await connection.connect()

  await cleanup({ verbose: true })

  await connection.close()
}

processCleanup().then(() => {
  console.log('[CleanUp] Cleanup finished')
})
