import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NoteEntity } from '../notes/note.entity'
import { PersonalDataEntity } from '../personal-data/personal-data.entity'
import { EmailService } from '../shared/email.service'
import { PkLoggerModule } from '../shared/pk-logger.module'
import { ShortcutEntity } from '../shortcuts/shortcut.entity'
import { DataBackupService } from './data-backup.service'
import { UsersController } from './user.controller'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'
import { getDotEnv } from '../utils'
import { JwtStrategy } from './jwt.strategy'
import { CyclingEntity } from '../cycling/cycling.entity'

getDotEnv()

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PK_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.PK_TOKEN_EXPIRY,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      UserEntity,
      ShortcutEntity,
      NoteEntity,
      PersonalDataEntity,
      CyclingEntity,
    ]),
    PkLoggerModule,
  ],
  providers: [UserService, JwtStrategy, EmailService, DataBackupService],
  exports: [JwtStrategy, PassportModule, UserService],
  controllers: [UsersController],
})
export class UserModule {}
