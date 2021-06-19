import { Body, Controller, HttpCode, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
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
import {
  LoginCodeRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
  SignupResponseDto,
  TokenRefreshRequestDto,
  TokenResponseDto,
} from './user.dto'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'
import { UserInBody } from '../utils/user-in-body.decorator'

@ApiTags('Users & Auth')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

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
  @UseGuards(AuthGuard())
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
}
