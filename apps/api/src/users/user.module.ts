import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailService } from 'src/shared/email.service'
import { PkLoggerModule } from 'src/shared/pk-logger.module'
import { UsersController } from 'src/users/user.controller'
import { UserEntity } from 'src/users/user.entity'
import { UserService } from 'src/users/user.service'
import { getDotEnv } from 'src/utils'
import { JwtStrategy } from './jwt.strategy'

getDotEnv()

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PK_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.PK_TOKEN_EXPIRY,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserEntity]),
    PkLoggerModule,
  ],
  providers: [UserService, JwtStrategy, EmailService],
  exports: [JwtStrategy, PassportModule, UserService],
  controllers: [UsersController],
})
export class UserModule {}
