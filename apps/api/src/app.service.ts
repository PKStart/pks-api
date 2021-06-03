import { Injectable } from '@nestjs/common'
import { TestType } from '@pk-start/common-types'

@Injectable()
export class AppService {
  getHello(): string {
    const something: TestType = {
      some: 'asd',
      thing: 23,
    }
    return 'Hello World!' + something.some
  }
}
