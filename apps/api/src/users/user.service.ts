import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { BulkWriteError } from 'mongodb'
import { EmailService } from 'src/shared/email.service'
import { EntityNotFoundError, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import * as bcrypt from 'bcrypt'
import { add, isBefore } from 'date-fns'
import { CustomApiError, UUID } from '@pk-start/common'
import { PkLogger } from 'src/shared/pk-logger.service'
import {
  JwtDecodedToken,
  LoginCodeRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
  SignupResponseDto,
  TokenResponseDto,
} from 'src/users/user.dto'
import { UserEntity } from 'src/users/user.entity'
import { getDotEnv } from 'src/utils'

getDotEnv()

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly logger: PkLogger,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
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
      this.logger.log(`User signed up: ${name} <${email}> with id ${user.id}`)
      await this.emailService.sendSignupNotification(email, name)
      return { id: user.id }
    } catch (error) {
      this.logger.error(error)
      if (error instanceof BulkWriteError && error.message?.includes('duplicate key')) {
        throw new ConflictException(CustomApiError.EMAIL_REGISTERED)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  public async requestLoginCode({ email }: LoginCodeRequestDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneOrFail({ email })
      const { loginCode, loginCodeExpires } = this.generateLoginCode()
      const { hashedLoginCode, salt } = await this.getHashed(loginCode)
      const updatedUser: UserEntity = {
        ...user,
        loginCode: hashedLoginCode,
        loginCodeExpires,
        salt,
      }
      await this.emailService.sendLoginCode(user.name, email, loginCode)
      return await this.userRepository.save(updatedUser)
    } catch (error) {
      this.logger.error(error)
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  public async login({ email, loginCode }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({ email })

    if (!user) {
      throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
    }

    const { id, name } = user
    const loginCodeMatch = await this.validateLoginCode(loginCode, user.salt, user.loginCode)
    const loginCodeValid = isBefore(new Date(), new Date(user.loginCodeExpires))

    if (!loginCodeMatch) {
      throw new UnauthorizedException(CustomApiError.INVALID_LOGIN_CODE)
    } else if (!loginCodeValid) {
      throw new UnauthorizedException(CustomApiError.EXPIRED_LOGIN_CODE)
    }

    const { token, expiresAt } = await this.getToken(email, id)

    this.logger.log(`User logged in: ${email} with id ${id}`)

    return {
      id,
      email,
      name,
      token,
      expiresAt,
    }
  }

  public async refreshToken(id: string): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOne({ id })

    if (!user) {
      throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
    }

    const { token, expiresAt } = await this.getToken(user.email, id)
    return {
      token,
      expiresAt,
    }
  }

  private async getToken(email: string, userId: UUID): Promise<{ token: string; expiresAt: Date }> {
    const token = await this.jwtService.sign({ email, userId })
    const expiresAt = new Date((this.jwtService.decode(token) as JwtDecodedToken).exp * 1000)
    return {
      token,
      expiresAt,
    }
  }

  private async getHashed(loginCode: string): Promise<{ hashedLoginCode: string; salt: string }> {
    const salt = await bcrypt.genSalt()
    const hashedLoginCode = await bcrypt.hash(loginCode, salt)
    return {
      hashedLoginCode,
      salt,
    }
  }

  private generateLoginCode(): { loginCode: string; loginCodeExpires: Date } {
    return {
      loginCode: Math.floor(100000 + Math.random() * 900000).toString(),
      loginCodeExpires: add(new Date(), {
        minutes: Number(process.env.PK_LOGIN_CODE_EXPIRY),
      }),
    }
  }

  private async validateLoginCode(
    loginCode: string,
    salt: string,
    hashedLoginCode: string
  ): Promise<boolean> {
    const hash = await bcrypt.hash(loginCode, salt)
    return hash === hashedLoginCode
  }
}
