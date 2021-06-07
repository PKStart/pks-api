import { NestFactory } from '@nestjs/core'
import { getDotEnv } from 'src/utils'
import { AppModule } from './app.module'

getDotEnv()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(8100)
}
bootstrap()
