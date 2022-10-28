import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { NoteEntity } from '../notes/note.entity'
import { PersonalDataEntity } from '../personal-data/personal-data.entity'
import { EmailService } from '../shared/email.service'
import { EntityNotFoundError, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import * as bcrypt from 'bcrypt'
import { add, isBefore } from 'date-fns'
import { CustomApiError, UUID } from 'pks-common'
import { PkLogger } from '../shared/pk-logger.service'
import { ShortcutEntity } from '../shortcuts/shortcut.entity'
import {
  JwtDecodedToken,
  LoginCodeRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  SignupRequestDto,
  SignupResponseDto,
  TokenResponseDto,
  UserSettings,
} from './user.dto'
import { UserEntity } from './user.entity'
import { CyclingEntity } from '../cycling/cycling.entity'
import { getDotEnv } from '../utils'

getDotEnv()

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ShortcutEntity)
    private readonly shortcutRepository: Repository<ShortcutEntity>,
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
    @InjectRepository(PersonalDataEntity)
    private readonly personalDataRepository: Repository<PersonalDataEntity>,
    @InjectRepository(CyclingEntity)
    private readonly cyclingRepository: Repository<CyclingEntity>,
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
      settings: {
        locationApiKey: null,
        weatherApiKey: null,
        shortcutIconBaseUrl: null,
        birthdaysUrl: null,
        koreanUrl: null,
        stravaClientId: null,
        stravaClientSecret: null,
        stravaRedirectUri: null,
      },
    }
    try {
      const user = await this.userRepository.save(this.userRepository.create(data))
      this.logger.log(`User signed up: ${name} <${email}> with id ${user.id}`)
      if (!email.includes('@test.com')) {
        await this.emailService.sendSignupNotification(email, name)
      }
      return { id: user.id }
    } catch (error) {
      this.logger.error(error)
      if (error.message?.includes('duplicate key')) {
        throw new ConflictException(CustomApiError.EMAIL_REGISTERED)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  public async requestLoginCode({ email }: LoginCodeRequestDto): Promise<UserEntity> {
    try {
      const { updatedUser, loginCode } = await this.getLoginCodeAndUpdatedUser(email)
      await this.emailService.sendLoginCode(updatedUser.name, email, loginCode)
      return await this.userRepository.save(updatedUser)
    } catch (error) {
      this.logger.error(error)
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  /**
   * Only for testing purposes
   */
  public async getInstantLoginCode({ email }: LoginCodeRequestDto): Promise<{ loginCode: string }> {
    if (process.env.PK_ENV !== 'development') {
      throw new ForbiddenException()
    }
    try {
      const { updatedUser, loginCode } = await this.getLoginCodeAndUpdatedUser(email)
      await this.userRepository.save(updatedUser)
      return { loginCode }
    } catch (error) {
      this.logger.error(error)
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
      }
      throw new InternalServerErrorException(error.message)
    }
  }

  public async login({ email, loginCode }: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findOne({ where: { email } })

    if (!user) {
      throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
    }

    const { id, name, settings } = user
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
      settings,
    }
  }

  public async refreshToken(id: UUID): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
    }

    const { token, expiresAt } = await this.getToken(user.email, id)
    return {
      token,
      expiresAt,
    }
  }

  public async updateSettings(id: UUID, settings: UserSettings): Promise<UserSettings> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
    }

    const updated: UserEntity = {
      ...user,
      settings,
    }

    await this.userRepository.update({ id }, updated)
    return settings
  }

  public async deleteUser(id: UUID): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user) {
      throw new NotFoundException(CustomApiError.USER_NOT_FOUND)
    }

    const shortcuts = await this.shortcutRepository.find({ where: { userId: id } })
    if (shortcuts.length) {
      await this.shortcutRepository.remove(shortcuts)
    }
    const notes = await this.noteRepository.find({ where: { userId: id } })
    if (notes.length) {
      await this.noteRepository.remove(notes)
    }
    const personalData = await this.personalDataRepository.find({ where: { userId: id } })
    if (personalData.length) {
      await this.personalDataRepository.remove(personalData)
    }
    const cyclingData = await this.cyclingRepository.findOne({ where: { userId: id } })
    if (cyclingData) {
      await this.cyclingRepository.remove(cyclingData)
    }
    await this.userRepository.delete({ id })
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

  private async getLoginCodeAndUpdatedUser(
    email: string
  ): Promise<{ updatedUser: UserEntity; loginCode: string }> {
    const user = await this.userRepository.findOneOrFail({ where: { email } })
    const { loginCode, loginCodeExpires } = this.generateLoginCode()
    const { hashedLoginCode, salt } = await this.getHashed(loginCode)
    const updatedUser: UserEntity = {
      ...user,
      loginCode: hashedLoginCode,
      loginCodeExpires,
      salt,
    }
    return {
      updatedUser,
      loginCode,
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
