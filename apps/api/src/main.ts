import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '../../.env' })

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  console.log('[main.ts] URL from .env:', process.env.PK_DB_URL)
  await app.listen(8100)
}
bootstrap()
