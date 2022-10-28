import { ConsoleLogger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { getDotEnv } from './utils'
import { AppModule } from './app.module'

getDotEnv()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Startpage v3')
    .setDescription('The Startpage v3 API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.PK_SERVER_SELF_URL)
    .addServer('http://localhost:8100')
    .build()
  const document = SwaggerModule.createDocument(app as any, config)
  SwaggerModule.setup('api', app as any, document)

  const port = process.env.PORT || 8100

  const logger = new ConsoleLogger()
  logger.setContext('NestApplication')

  await app.listen(port, '0.0.0.0', () => {
    logger.log(`Listening on port ${port}`)
  })
}
bootstrap()
