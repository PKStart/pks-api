import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DataSource, DataSourceOptions, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanup } from '../seeding'
import { AppModule } from '../src/app.module'
import { PersonalDataEntity } from '../src/personal-data/personal-data.entity'
import { signupAndLogin } from './commands/handle-user'
import { CustomApiError, CustomValidationError } from 'pks-common'
import { data1, data2, data3, testUser, testUser2 } from './test-data'
import ormConfig from '../ormconfig'

describe('PersonalDataController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let personalDataRepository: Repository<PersonalDataEntity>
  let token: string
  let tokenOther: string
  let userId: string
  let dataId: string
  let countBeforeAll: number

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dataSource = new DataSource(ormConfig as DataSourceOptions)
    await dataSource.initialize()
    personalDataRepository = dataSource.getRepository(PersonalDataEntity)

    countBeforeAll = await personalDataRepository.count()

    const userData = await signupAndLogin(app, testUser)
    token = userData.token
    userId = userData.userId
    const user2Data = await signupAndLogin(app, testUser2)
    tokenOther = user2Data.token
  })

  afterAll(async () => {
    await cleanup(dataSource)
    await dataSource.destroy()
    await app.close()
  })

  it('Should receive 404 for getting personal data for a new user', () => {
    return request(app.getHttpServer())
      .get('/personal-data')
      .auth(token, { type: 'bearer' })
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(CustomApiError.ITEM_NOT_FOUND)
      })
  })

  it('Should create a new personal data object', () => {
    return request(app.getHttpServer())
      .post('/personal-data')
      .auth(token, { type: 'bearer' })
      .send(data1)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        dataId = res.body.id
      })
  })

  it('Should create a second new personal data object', () => {
    return request(app.getHttpServer())
      .post('/personal-data')
      .auth(token, { type: 'bearer' })
      .send(data2)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
      })
      .then(async () => {
        const count = await personalDataRepository.count()
        expect(count).toEqual(countBeforeAll + 2)
      })
  })

  it('Should sign up a new user and create a personal data object', async () => {
    return request(app.getHttpServer())
      .post('/personal-data')
      .auth(tokenOther, { type: 'bearer' })
      .send(data3)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
      })
      .then(async () => {
        const count = await personalDataRepository.count()
        expect(count).toEqual(countBeforeAll + 3)
      })
  })

  it('Should get a list of proper objects only for the current user', async () => {
    const totalCount = await personalDataRepository.count()
    expect(totalCount).toEqual(countBeforeAll + 3)

    return request(app.getHttpServer())
      .get('/personal-data')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toEqual(2)
        expect(res.body.map(i => i.id)).toContain(dataId)
        expect(res.body.map(i => i.userId).every(id => id === userId)).toBeTruthy()
        res.body.forEach(item => {
          expect(item).toHaveProperty('id')
          expect(item).toHaveProperty('userId')
          expect(item).toHaveProperty('name')
          expect(item).toHaveProperty('identifier')
        })
      })
  })

  it('Should get proper errors for invalid create object', () => {
    return request(app.getHttpServer())
      .post('/personal-data')
      .auth(token, { type: 'bearer' })
      .send({
        identifier: 11223344,
        expiry: '2022.12.11',
      })
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(3)
        expect(res.body.message).toContain(CustomValidationError.STRING_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.INVALID_DATE)
      })
  })

  it('Should fail to update without item id', () => {
    return request(app.getHttpServer())
      .put('/personal-data')
      .auth(token, { type: 'bearer' })
      .send(data1)
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(2)
        expect(res.body.message).toContain(CustomValidationError.STRING_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.INVALID_UUID)
      })
  })

  it("Should fail to update an other user's item", () => {
    return request(app.getHttpServer())
      .put('/personal-data')
      .auth(tokenOther, { type: 'bearer' })
      .send({ id: dataId, ...data1 })
      .expect(403)
  })

  it('Should fail to update a non existing item', () => {
    return request(app.getHttpServer())
      .put('/personal-data')
      .auth(token, { type: 'bearer' })
      .send({ id: uuid(), ...data1 })
      .expect(404)
  })

  it("Should fail to delete an other user's item", () => {
    return request(app.getHttpServer())
      .delete('/personal-data')
      .auth(tokenOther, { type: 'bearer' })
      .send({ id: dataId })
      .expect(403)
  })

  it('Should fail to delete a non existing item', () => {
    return request(app.getHttpServer())
      .delete('/personal-data')
      .auth(token, { type: 'bearer' })
      .send({ id: uuid() })
      .expect(404)
  })

  it('Should successfully update an item', async () => {
    await request(app.getHttpServer())
      .put('/personal-data')
      .auth(token, { type: 'bearer' })
      .send({
        ...data1,
        id: dataId,
        name: 'New name',
      })
      .expect(200)

    return request(app.getHttpServer())
      .get('/personal-data')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        const item = res.body.find(i => i.id === dataId)
        expect(item).toBeDefined()
        expect(item.name).toEqual('New name')
      })
  })

  it('Should successfully delete an item', async () => {
    await request(app.getHttpServer())
      .delete('/personal-data')
      .auth(token, { type: 'bearer' })
      .send({ id: dataId })
      .expect(200)

    return request(app.getHttpServer())
      .get('/personal-data')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toEqual(1)
      })
      .then(async () => {
        const count = await personalDataRepository.count()
        expect(count).toEqual(countBeforeAll + 2)
      })
  })
})
