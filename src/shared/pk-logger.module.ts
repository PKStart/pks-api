import { Module } from '@nestjs/common'
import { PkLogger } from './pk-logger.service'

@Module({
  providers: [PkLogger],
  exports: [PkLogger],
})
export class PkLoggerModule {}
