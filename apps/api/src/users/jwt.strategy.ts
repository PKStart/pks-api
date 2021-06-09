import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { UUID } from '@pk-start/common'
import { UserEntity } from 'src/users/user.entity'
import { getDotEnv } from 'src/utils'

getDotEnv()

export interface JwtPayload {
  email: string
  id: UUID
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.PK_JWT_SECRET,
    })
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { id } = payload
    const user = await this.usersRepository.findOne({ id })
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
