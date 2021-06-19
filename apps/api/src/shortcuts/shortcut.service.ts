import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { UUID } from '@pk-start/common'
import { CreateShortcutRequestDto, ShortcutIdResponseDto } from './shortcut.dto'
import { ShortcutEntity } from './shortcut.entity'

@Injectable()
export class ShortcutService {
  constructor(
    @InjectRepository(ShortcutEntity)
    private readonly shortcutRepository: Repository<ShortcutEntity>
  ) {}

  public async getAllForUser(userId: UUID): Promise<ShortcutEntity[]> {
    return this.shortcutRepository.find({ userId })
  }

  public async createShortcut(
    request: CreateShortcutRequestDto,
    userId: UUID
  ): Promise<ShortcutIdResponseDto> {
    const shortcut: ShortcutEntity = await this.shortcutRepository.save(
      this.shortcutRepository.create({
        ...request,
        userId,
        id: uuid(),
        createdAt: new Date(),
      })
    )
    return {
      id: shortcut.id,
    }
  }
}
