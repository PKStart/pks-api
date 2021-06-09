import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CustomApiError } from '@pk-start/common'
import { add } from 'date-fns'
import { PkLogger } from 'src/shared/pk-logger.service'
import {
  LoginCodeRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
  SignupResponseDto,
} from 'src/users/user.dto'
import { UserEntity } from 'src/users/user.entity'
import { getDotEnv } from 'src/utils'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'

getDotEnv()

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly logger: PkLogger
  ) {
    logger.setContext('UserService')
  }

  public async createUser({ email, name }: SignupRequestDto): Promise<SignupResponseDto> {
    const data: Partial<UserEntity> = {
      id: uuid(),
      createdAt: new Date(),
      email,
      name,
    }
    try {
      const user = await this.userRepository.save(this.userRepository.create(data))
      return { id: user.id }
    } catch (error) {
      this.logger.error(error)
      if (error.message?.includes('duplicate key')) {
        throw new ConflictException(CustomApiError.EMAIL_REGISTERED)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  public async generateLoginCode({ email }: LoginCodeRequestDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneOrFail({ email })
      const loginCode = Math.floor(100000 + Math.random() * 900000).toString()
      const loginCodeExpiresAt = add(new Date(), {
        seconds: Number(process.env.PK_LOGIN_CODE_EXPIRY),
      })
      const updatedUser = {
        ...user,
        loginCode,
        loginCodeExpiresAt,
      }
      return await this.userRepository.save(updatedUser)
    } catch (error) {
      console.log(error)
      // TODO handle error
    }
  }

  public async login({ email, loginCode }: LoginRequestDto): Promise<LoginResponseDto> {
    throw new NotImplementedException()
  }
}
