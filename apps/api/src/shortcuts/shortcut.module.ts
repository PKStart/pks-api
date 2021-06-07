import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShortcutEntity } from 'src/shortcuts/shortcut.entity'
import { ShortcutService } from 'src/shortcuts/shortcut.service'

@Module({
  imports: [TypeOrmModule.forFeature([ShortcutEntity])],
  controllers: [],
  providers: [ShortcutService],
  exports: [ShortcutService],
})
export class ShortcutModule {}
