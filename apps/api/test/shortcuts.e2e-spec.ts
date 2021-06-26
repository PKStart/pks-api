import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication } from '@nestjs/common'
import { deleteUser, signupAndLogin } from './commands/handle-user'
import { CustomApiError } from '@pk-start/common'

describe('ShortcutController (e2e)', () => {
  let app: INestApplication
  let token: string
  let userId: string

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    const userData = await signupAndLogin(app)
    token = userData.token
    userId = userData.userId
  })

  afterAll(async () => {
    await deleteUser(app, token)
    await app.close()
  })

  it('Should receive 404 for getting shortcuts for a new user', () => {
    return request(app.getHttpServer())
      .get('/shortcuts')
      .auth(token, { type: 'bearer' })
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(CustomApiError.ITEM_NOT_FOUND)
      })
  })
})
