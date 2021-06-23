import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import ormConfig from '../ormconfig'
import { AppController } from './app.controller'
import { ShortcutModule } from './shortcuts/shortcut.module'
import { UserModule } from './users/user.module'

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), UserModule, ShortcutModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
