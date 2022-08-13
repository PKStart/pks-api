import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtPayload } from './user.dto'
import { Repository } from 'typeorm'
import { UserEntity } from './user.entity'
import { getDotEnv } from '../utils'

getDotEnv()

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

  async validate({ userId }: JwtPayload): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    })
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
