import { Injectable } from '@nestjs/common'
import { TestEnum, TestType } from '@pk-start/common'

@Injectable()
export class AppService {
  public something: TestType = {
    some: 'asd',
    thing: 23,
    more: TestEnum.THING,
  }
  getHello(): string {
    return 'Hello World! ' + this.something.some
  }
}
