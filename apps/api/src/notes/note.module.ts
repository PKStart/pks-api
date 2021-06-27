import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PkLogger } from '../shared/pk-logger.service'
import { NoteController } from './note.controller'
import { NoteEntity } from './note.entity'
import { NoteService } from './note.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [NoteController],
  providers: [NoteService, PkLogger],
  exports: [NoteService],
})
export class NoteModule {}
