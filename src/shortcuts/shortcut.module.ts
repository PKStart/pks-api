import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PkLogger } from '../shared/pk-logger.service'
import { ShortcutController } from './shortcut.controller'
import { ShortcutEntity } from './shortcut.entity'
import { ShortcutService } from './shortcut.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([ShortcutEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ShortcutController],
  providers: [ShortcutService, PkLogger],
  exports: [ShortcutService],
})
export class ShortcutModule {}
