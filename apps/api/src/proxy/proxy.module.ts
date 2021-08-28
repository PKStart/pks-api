import { HttpModule, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { PkLogger } from '../shared/pk-logger.service'
import { ProxyController } from './proxy.controller'
import { ProxyService } from './proxy.service'

@Module({
  imports: [HttpModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ProxyController],
  providers: [ProxyService, PkLogger],
  exports: [],
})
export class ProxyModule {}
