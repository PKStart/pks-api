import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShortcutEntity } from './shortcut.entity'
import { ShortcutService } from './shortcut.service'

@Module({
  imports: [TypeOrmModule.forFeature([ShortcutEntity])],
  controllers: [],
  providers: [ShortcutService],
  exports: [ShortcutService],
})
export class ShortcutModule {}
