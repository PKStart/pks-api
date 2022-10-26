import { Module } from '@nestjs/common'
import { CyclingService } from './cycling.service'
import { CyclingController } from './cycling.controller'
import { PkLogger } from '../shared/pk-logger.service'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CyclingEntity } from './cycling.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([CyclingEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CyclingController],
  providers: [CyclingService, PkLogger],
  exports: [CyclingService],
})
export class CyclingModule {}
