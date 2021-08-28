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
  CreateShortcutRequestDto,
  DeleteShortcutRequestDto,
  ShortcutDto,
  ShortcutIdResponseDto,
  UpdateShortcutRequestDto,
} from './shortcut.dto'
import { ShortcutService } from './shortcut.service'

@ApiTags('Shortcuts')
@Controller('shortcuts')
export class ShortcutController {
  constructor(private readonly shortcutService: ShortcutService) {}

  @Get()
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.shortcuts.getAll.operation)
  @ApiOkResponse(apiDocs.shortcuts.getAll.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  public async getAllForUser(@GetUser() user: UserEntity): Promise<ShortcutDto[]> {
    return this.shortcutService.getAllForUser(user.id)
  }

  @Post()
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.shortcuts.create.operation)
  @ApiCreatedResponse(apiDocs.shortcuts.create.created)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async create(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: CreateShortcutRequestDto
  ): Promise<ShortcutIdResponseDto> {
    return this.shortcutService.createShortcut(request, user.id)
  }

  @Put()
  @UseGuards(PkAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.shortcuts.update.operation)
  @ApiOkResponse(apiDocs.shortcuts.update.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  @ApiForbiddenResponse(apiDocs.generic.forbidden)
  public async update(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: UpdateShortcutRequestDto
  ): Promise<ShortcutIdResponseDto> {
    return this.shortcutService.updateShortcut(request, user.id)
  }

  @Delete()
  @UseGuards(PkAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.shortcuts.delete.operation)
  @ApiOkResponse(apiDocs.shortcuts.delete.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  @ApiForbiddenResponse(apiDocs.generic.forbidden)
  public async delete(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) request: DeleteShortcutRequestDto
  ): Promise<ShortcutIdResponseDto> {
    return this.shortcutService.deleteShortcut(request, user.id)
  }
}
