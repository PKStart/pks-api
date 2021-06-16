import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  LoginCodeRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
  SignupResponseDto,
  TokenRefreshRequestDto,
  TokenResponseDto,
} from 'src/users/user.dto'
import { UserService } from 'src/users/user.service'

@ApiTags('Users & Auth')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({ type: SignupResponseDto, description: 'User is created' })
  @ApiConflictResponse({ description: 'Email is already registered' })
  @ApiBadRequestResponse({ description: 'Validation error: request data is invalid' })
  public async signup(@Body(ValidationPipe) request: SignupRequestDto): Promise<SignupResponseDto> {
    return this.userService.createUser(request)
  }

  @Post('/login-code')
  @ApiOperation({ summary: 'Send a login code for the user' })
  @ApiCreatedResponse({ description: 'Login code is sent' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Validation error: request data is invalid' })
  public async getLoginCode(@Body(ValidationPipe) request: LoginCodeRequestDto): Promise<void> {
    await this.userService.requestLoginCode(request)
    return
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in using login code' })
  @ApiOkResponse({ type: LoginResponseDto, description: 'Successfully logged in' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Validation error: request data is invalid' })
  public async login(@Body(ValidationPipe) request: LoginRequestDto): Promise<LoginResponseDto> {
    return this.userService.login(request)
  }

  @Post('/token-refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a new access token for a user' })
  @ApiOkResponse({ type: TokenResponseDto, description: 'New token is generated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Validation error: request data is invalid' })
  public async tokenRefresh(
    @Body(ValidationPipe) request: TokenRefreshRequestDto
  ): Promise<TokenResponseDto> {
    return this.userService.refreshToken(request.userId)
  }
}
