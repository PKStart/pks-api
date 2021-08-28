import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { cleanup } from '../seeding'
import { AppModule } from '../src/app.module'
import { INestApplication } from '@nestjs/common'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await cleanup()
    await app.close()
  })

  it('Should respond for a wakeup call', () => {
    return request(app.getHttpServer())
      .get('/wakeup')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('result')
        expect(res.body.result).toEqual('API is up and running!')
      })
  })
})
