import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { CustomApiError, CustomValidationError, UrlRegex, UUID } from 'pks-common'
import { PkLogger } from '../shared/pk-logger.service'
import { omitObjectId } from '../utils'
import {
  CreateNoteRequestDto,
  DeleteNoteRequestDto,
  NoteDto,
  NoteIdResponseDto,
  UpdateNoteRequestDto,
} from './note.dto'
import { NoteEntity } from './note.entity'

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    private readonly logger: PkLogger
  ) {
    logger.setContext('NoteService')
  }

  public async getAllForUser(userId: UUID): Promise<NoteDto[]> {
    const results = await this.noteRepository.find({ where: { userId } })
    if (!results.length) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    return results.map(omitObjectId)
  }

  public async createNote(request: CreateNoteRequestDto, userId: UUID): Promise<NoteIdResponseDto> {
    this.validateNote(request)
    const note: NoteEntity = await this.noteRepository.save(
      this.noteRepository.create({
        ...request,
        userId,
        id: uuid(),
        createdAt: new Date(),
      })
    )
    return {
      id: note.id,
    }
  }

  public async updateNote(request: UpdateNoteRequestDto, userId: UUID): Promise<NoteIdResponseDto> {
    this.validateNote(request)
    const note = await this.noteRepository.findOne({ where: { id: request.id } })
    if (!note) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    if (note.userId !== userId) {
      throw new ForbiddenException()
    }
    await this.noteRepository.update({ id: request.id }, request)
    return { id: request.id }
  }

  public async deleteNote({ id }: DeleteNoteRequestDto, userId: UUID): Promise<NoteIdResponseDto> {
    const item = await this.noteRepository.findOne({ where: { id } })
    if (!item) {
      throw new NotFoundException(CustomApiError.ITEM_NOT_FOUND)
    }
    if (item.userId !== userId) {
      throw new ForbiddenException()
    }
    await this.noteRepository.delete({ id })
    return { id }
  }

  private validateNote(request: CreateNoteRequestDto | UpdateNoteRequestDto): void {
    const errors = []
    if (!request.text && (!request.links || !request.links.length)) {
      errors.push(CustomValidationError.TEXT_OR_LINK_REQUIRED)
    } else if (request.links && request.links.length) {
      for (const link of request.links) {
        if (typeof link !== 'object' || (!link.name && !link.url)) {
          errors.push(CustomValidationError.INVALID_LINK)
          break
        }
        if (!link.name || typeof link.name !== 'string') {
          errors.push(CustomValidationError.STRING_REQUIRED)
        }
        if (!link.url || typeof link.url !== 'string' || !UrlRegex.test(link.url.trim())) {
          errors.push(CustomValidationError.INVALID_URL)
        }
      }
    }
    if (errors.length) {
      throw new BadRequestException(errors)
    }
  }
}
