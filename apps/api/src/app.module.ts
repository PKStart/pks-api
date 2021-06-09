import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ShortcutModule } from 'src/shortcuts/shortcut.module'
import { UserModule } from 'src/users/user.module'
import { getDotEnv } from 'src/utils'
import { AppController } from './app.controller'
import { AppService } from './app.service'

getDotEnv()

const ormConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.PK_DB_CONNECTION_STRING,
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: true,
  useUnifiedTopology: true,
}

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UserModule, ShortcutModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
