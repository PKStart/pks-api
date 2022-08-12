import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getDotEnv } from './src/utils'

getDotEnv()

const ormConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'mongodb',
  url: process.env.PK_DB_CONNECTION_STRING,
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: true,
  useUnifiedTopology: true,
}

export default ormConfig
