import { Module } from '@nestjs/common'
import { CyclingService } from './cycling.service'
import { CyclingController } from './cycling.controller'
import { PkLogger } from '../shared/pk-logger.service'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    // TypeOrmModule.forFeature([CyclingEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CyclingController],
  providers: [CyclingService, PkLogger],
  exports: [CyclingService],
})
export class CyclingModule {}
