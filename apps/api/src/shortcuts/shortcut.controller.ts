import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { apiDocs } from '../shared/api-docs'
import { UserEntity } from '../users/user.entity'
import { GetUser, UserInBody } from '../utils'
import {
  CreateShortcutRequestDto,
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
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation(apiDocs.shortcuts.getAll.operation)
  @ApiOkResponse(apiDocs.shortcuts.getAll.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  public async getAllForUser(@GetUser() user: UserEntity): Promise<ShortcutDto[]> {
    return this.shortcutService.getAllForUser(user.id)
  }

  @Post()
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.shortcuts.update.operation)
  @ApiOkResponse(apiDocs.shortcuts.update.ok)
  @ApiNotFoundResponse(apiDocs.generic.itemNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async update(
    @UserInBody() _user: UserEntity,
    @Body(ValidationPipe) request: UpdateShortcutRequestDto
  ): Promise<ShortcutIdResponseDto> {
    return this.shortcutService.updateShortcut(request)
  }
}
