import { Body, Controller, Post, ValidationPipe } from '@nestjs/common'
import { LoginCodeRequestDto, SignupRequestDto, SignupResponseDto } from 'src/users/user.dto'
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
    await this.userService.generateLoginCode(request)
    return
  }
}
