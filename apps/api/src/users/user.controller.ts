import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { apiDocs } from '../shared/api-docs'
import { DataBackupService } from './data-backup.service'
import { PkAuthGuard } from './pk-auth-guard'
import {
  LoginCodeRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
  SignupResponseDto,
  TokenRefreshRequestDto,
  TokenResponseDto,
  UserSettings,
} from './user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'
import { GetUser, UserInBody } from '../utils'

@ApiTags('Users & Auth')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private dataBackupService: DataBackupService
  ) {}

  @Post('/signup')
  @ApiOperation(apiDocs.users.signup.operation)
  @ApiCreatedResponse(apiDocs.users.signup.created)
  @ApiConflictResponse(apiDocs.users.signup.conflict)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async signup(@Body(ValidationPipe) request: SignupRequestDto): Promise<SignupResponseDto> {
    return this.userService.createUser(request)
  }

  @Post('/login-code')
  @ApiOperation(apiDocs.users.loginCode.operation)
  @ApiCreatedResponse(apiDocs.users.loginCode.created)
  @ApiNotFoundResponse(apiDocs.generic.userNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async getLoginCode(@Body(ValidationPipe) request: LoginCodeRequestDto): Promise<void> {
    await this.userService.requestLoginCode(request)
    return
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation(apiDocs.users.login.operation)
  @ApiOkResponse(apiDocs.users.login.ok)
  @ApiNotFoundResponse(apiDocs.generic.userNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async login(@Body(ValidationPipe) request: LoginRequestDto): Promise<LoginResponseDto> {
    return this.userService.login(request)
  }

  @Post('/token-refresh')
  @HttpCode(200)
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.users.tokenRefresh.operation)
  @ApiOkResponse(apiDocs.users.tokenRefresh.ok)
  @ApiNotFoundResponse(apiDocs.generic.userNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  @ApiForbiddenResponse(apiDocs.generic.forbidden)
  public async tokenRefresh(
    @Body(ValidationPipe) request: TokenRefreshRequestDto,
    @UserInBody() _user: UserEntity
  ): Promise<TokenResponseDto> {
    return this.userService.refreshToken(request.userId)
  }

  @Post('/settings')
  @HttpCode(201)
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.users.addSettings.operation)
  @ApiOkResponse(apiDocs.users.addSettings.created)
  @ApiNotFoundResponse(apiDocs.generic.userNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  @ApiForbiddenResponse(apiDocs.generic.forbidden)
  public async addSettings(
    @Body(ValidationPipe) request: UserSettings,
    @GetUser() user: UserEntity
  ): Promise<UserSettings> {
    return this.userService.updateSettings(user.id, request)
  }

  @Delete()
  @HttpCode(200)
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.users.delete.operation)
  @ApiOkResponse(apiDocs.users.delete.ok)
  @ApiNotFoundResponse(apiDocs.generic.userNotFound)
  public async deleteUser(@GetUser() user: UserEntity): Promise<void> {
    return this.userService.deleteUser(user.id)
  }

  @Get('/data-backup')
  @HttpCode(200)
  @UseGuards(PkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation(apiDocs.users.backup.operation)
  @ApiOkResponse(apiDocs.users.backup.ok)
  @ApiNotFoundResponse(apiDocs.generic.userNotFound)
  public async getDataBackup(@GetUser() user: UserEntity): Promise<{ result: string }> {
    await this.dataBackupService.backupDataForUser(user.id)
    return { result: 'Backup email sent successfully' }
  }

  /**
   * Only for testing purposes!
   */
  @Post('/debug/login-code')
  @ApiOperation(apiDocs.users.debugLoginCode.operation)
  @ApiCreatedResponse(apiDocs.users.debugLoginCode.created)
  @ApiNotFoundResponse(apiDocs.generic.userNotFound)
  @ApiBadRequestResponse(apiDocs.generic.validationError)
  public async getDebugLoginCode(
    @Body(ValidationPipe) request: LoginCodeRequestDto
  ): Promise<{ loginCode: string }> {
    if (process.env.PK_ENV !== 'development') {
      throw new ForbiddenException()
    }
    return this.userService.getInstantLoginCode(request)
  }
}
