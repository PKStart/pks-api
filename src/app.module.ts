import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import ormConfig from '../ormconfig'
import { AppController } from './app.controller'
import { NoteModule } from './notes/note.module'
import { PersonalDataModule } from './personal-data/personal-data.module'
import { ProxyModule } from './proxy/proxy.module'
import { ShortcutModule } from './shortcuts/shortcut.module'
import { UserModule } from './users/user.module'
import { CyclingModule } from './cycling/cycling.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    ShortcutModule,
    NoteModule,
    PersonalDataModule,
    CyclingModule,
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
