import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication } from '@nestjs/common'
import { CustomApiError } from '@pk-start/common'

describe('UserController (e2e)', () => {
  let app: INestApplication
  let loginCode: string
  let token: string

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should sign a user up', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: 'test7@test.com', name: 'Test' })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
      })
  })

  it('Should fail to sign a user up with the same email', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: 'test7@test.com', name: 'Test' })
      .expect(409)
      .expect(res => {
        expect(res.body.message).toBe(CustomApiError.EMAIL_REGISTERED)
      })
  })
})
