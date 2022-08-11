import { Connection, getConnectionManager } from 'typeorm'
import { getDotEnv } from '../src/utils'
import { entities } from './entity-record'

getDotEnv()

export function useConnection(): { connection: Connection } {
  const connectionManager = getConnectionManager()

  const connection: Connection = connectionManager.create({
    type: 'mongodb',
    url: process.env.PK_DB_CONNECTION_STRING,
    synchronize: true,
    useUnifiedTopology: true,
    entities: Object.values(entities),
  })

  return { connection }
}
