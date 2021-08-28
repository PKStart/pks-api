import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import ormConfig from '../ormconfig'
import { AppController } from './app.controller'
import { NoteModule } from './notes/note.module'
import { PersonalDataModule } from './personal-data/personal-data.module'
import { ShortcutModule } from './shortcuts/shortcut.module'
import { UserModule } from './users/user.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    ShortcutModule,
    NoteModule,
    PersonalDataModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
