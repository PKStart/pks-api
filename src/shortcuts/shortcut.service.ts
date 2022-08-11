import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { CustomApiError, UUID } from 'pks-common'
import { PkLogger } from '../shared/pk-logger.service'
import { omitObjectId } from '../utils'
import {
  CreateShortcutRequestDto,
  DeleteShortcutRequestDto,
  ShortcutDto,
  ShortcutIdResponseDto,
  UpdateShortcutRequestDto,
} from './shortcut.dto'
import { ShortcutEntity } from './shortcut.entity'

@Injectable()
export class ShortcutService {
  constructor(
    @InjectRepository(ShortcutEntity)
    private readonly shortcutRepository: Repository<ShortcutEntity>,
    private readonly logger: PkLogger
  ) {
    logger.setContext('ShortcutService')
  }

  public async getAllForUser(userId: UUID): Promise<ShortcutDto[]> {
    const results = await this.shortcutRepository.find({ where: { userId } })
    if (!results.length) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    return results.map(omitObjectId)
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

  public async updateShortcut(
    request: UpdateShortcutRequestDto,
    userId: UUID
  ): Promise<ShortcutIdResponseDto> {
    const shortcut = await this.shortcutRepository.findOne({ where: { id: request.id } })
    if (!shortcut) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    if (shortcut.userId !== userId) {
      throw new ForbiddenException()
    }
    await this.shortcutRepository.update({ id: request.id }, request)
    return { id: request.id }
  }

  public async deleteShortcut(
    { id }: DeleteShortcutRequestDto,
    userId: UUID
  ): Promise<ShortcutIdResponseDto> {
    const item = await this.shortcutRepository.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    if (item.userId !== userId) {
      throw new ForbiddenException()
    }
    await this.shortcutRepository.delete({ id })
    return { id }
  }
}
