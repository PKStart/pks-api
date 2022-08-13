import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { cleanup } from '../seeding'
import { AppModule } from '../src/app.module'
import { INestApplication } from '@nestjs/common'
import { DataSource, DataSourceOptions } from 'typeorm'
import ormconfig from '../ormconfig'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dataSource = new DataSource(ormconfig as DataSourceOptions)
    await dataSource.initialize()
  })

  afterAll(async () => {
    await cleanup(dataSource)
    await dataSource.destroy()
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
