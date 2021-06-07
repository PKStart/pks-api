import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { ShortcutEntity } from 'src/shortcuts/shortcut.entity'

@Injectable()
export class ShortcutService {
  constructor(
    @InjectRepository(ShortcutEntity)
    private readonly shortcutRepository: Repository<ShortcutEntity>
  ) {}

  async makeShortcut(): Promise<void> {
    await this.shortcutRepository.save(
      this.shortcutRepository.create({ id: uuid(), name: 'testName' })
    )
  }
}
