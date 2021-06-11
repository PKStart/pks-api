import { Body, Controller, Post, ValidationPipe } from '@nestjs/common'
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

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  public async signup(@Body(ValidationPipe) request: SignupRequestDto): Promise<SignupResponseDto> {
    return this.userService.createUser(request)
  }

  @Post('/login-code')
  public async getLoginCode(@Body(ValidationPipe) request: LoginCodeRequestDto): Promise<void> {
    await this.userService.requestLoginCode(request)
    return
  }

  @Post('/login')
  public async login(@Body(ValidationPipe) request: LoginRequestDto): Promise<LoginResponseDto> {
    return this.userService.login(request)
  }

  @Post('/token-refresh')
  public async tokenRefresh(
    @Body(ValidationPipe) request: TokenRefreshRequestDto
  ): Promise<TokenResponseDto> {
    return this.userService.refreshToken(request.userId)
  }
}
