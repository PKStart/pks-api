import { Injectable } from '@nestjs/common'

@Injectable()
export class CyclingService {
  public async getDummy(): Promise<string> {
    return 'Go for a ride!'
  }
}
