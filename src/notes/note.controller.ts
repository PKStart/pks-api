import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { apiDocs } from '../shared/api-docs'
import { PkAuthGuard } from '../users/pk-auth-guard'
import { UserEntity } from '../users/user.entity'
import { GetUser } from '../utils'
import {
  CreateNoteRequestDto,
  DeleteNoteRequestDto,
  NoteDto,
  NoteIdResponseDto,
  UpdateNoteRequestDto,
} from './note.dto'
import { NoteService } from './note.service'

@ApiTags('Notes')
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.notes.getAll.operation)
  @ApiOkResponse(apiDocs.notes.getAll.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  public async getAllForUser(@GetUser() user: UserEntity): Promise<NoteDto[]> {
    return this.noteService.getAllForUser(user.id)
  }

  @Post()
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.notes.create.operation)
  @ApiCreatedResponse(apiDocs.notes.create.created)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async create(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: CreateNoteRequestDto
  ): Promise<NoteIdResponseDto> {
    return this.noteService.createNote(request, user.id)
  }

  @Put()
  @UseGuards(PkAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.notes.update.operation)
  @ApiOkResponse(apiDocs.notes.update.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  @ApiForbiddenResponse(apiDocs.generic.forbidden)
  public async update(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: UpdateNoteRequestDto
  ): Promise<NoteIdResponseDto> {
    return this.noteService.updateNote(request, user.id)
  }

  @Delete()
  @UseGuards(PkAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.notes.delete.operation)
  @ApiOkResponse(apiDocs.notes.delete.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  @ApiForbiddenResponse(apiDocs.generic.forbidden)
  public async delete(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: DeleteNoteRequestDto
  ): Promise<NoteIdResponseDto> {
    return this.noteService.deleteNote(request, user.id)
  }
}
