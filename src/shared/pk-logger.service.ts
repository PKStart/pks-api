import { Injectable, Scope, ConsoleLogger } from '@nestjs/common'

@Injectable({ scope: Scope.TRANSIENT })
export class PkLogger extends ConsoleLogger {}
