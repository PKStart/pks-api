import { Module } from '@nestjs/common'
import { PkLogger } from 'src/shared/pk-logger.service'

@Module({
  providers: [PkLogger],
  exports: [PkLogger],
})
export class PkLoggerModule {}
