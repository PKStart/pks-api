import { Injectable } from '@nestjs/common'
import { TestEnum, TestType } from '@pk-start/common'

@Injectable()
export class AppService {
  getHello(): string {
    const something: TestType = {
      some: 'asd',
      thing: 23,
      more: TestEnum.SOME,
    }
    return 'Hello World!' + something.some + something.more
  }
}
