import { Injectable } from '@nestjs/common'
import { TestEnum, TestType } from '@pk-start/common'
import { ShortcutService } from 'src/shortcuts/shortcut.service'

@Injectable()
export class AppService {
  constructor(private readonly shortcutService: ShortcutService) {}
  public something: TestType = {
    some: 'asd',
    thing: 23,
    more: TestEnum.THING,
  }
  async getHello(): Promise<string> {
    await this.shortcutService.makeShortcut()
    return 'Hello World! ' + this.something.some
  }
}
