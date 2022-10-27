import { INestApplication } from '@nestjs/common'
import { DataSource, DataSourceOptions } from 'typeorm'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import ormConfig from '../ormconfig'
import { signupAndLogin } from './commands/handle-user'
import { testUser } from './test-data'
import { cleanup } from '../seeding'
import * as request from 'supertest'
import { CustomApiError, CustomValidationError } from 'pks-common'

describe('CyclingController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let token: string
  let userId: string
  let choreId: string

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dataSource = new DataSource(ormConfig as DataSourceOptions)
    await dataSource.initialize()

    const userData = await signupAndLogin(app, testUser)
    token = userData.token
    userId = userData.userId
  })

  afterAll(async () => {
    await cleanup(dataSource)
    await dataSource.destroy()
    await app.close()
  })

  it('Should receive 404 for getting cycling data for a new user', () => {
    return request(app.getHttpServer())
      .get('/cycling')
      .auth(token, { type: 'bearer' })
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(CustomApiError.ITEM_NOT_FOUND)
      })
  })

  it('Should set up new monthly goal', () => {
    return request(app.getHttpServer())
      .put('/cycling/monthly-goal')
      .auth(token, { type: 'bearer' })
      .send({ monthlyGoal: 700 })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('userId')
        expect(res.body.userId).toEqual(userId)
        expect(res.body).toHaveProperty('monthlyGoal')
        expect(res.body.monthlyGoal).toEqual(700)
        expect(res.body).toHaveProperty('weeklyGoal')
        expect(res.body.weeklyGoal).toEqual(null)
        expect(res.body).toHaveProperty('chores')
        expect(res.body.chores.length).toEqual(0)
      })
  })

  it('Should set up new weekly goal', () => {
    return request(app.getHttpServer())
      .put('/cycling/weekly-goal')
      .auth(token, { type: 'bearer' })
      .send({ weeklyGoal: 70 })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('userId')
        expect(res.body.userId).toEqual(userId)
        expect(res.body).toHaveProperty('monthlyGoal')
        expect(res.body.monthlyGoal).toEqual(700)
        expect(res.body).toHaveProperty('weeklyGoal')
        expect(res.body.weeklyGoal).toEqual(70)
        expect(res.body).toHaveProperty('chores')
        expect(res.body.chores.length).toEqual(0)
      })
  })

  it('Should overwrite the weekly goal', () => {
    return request(app.getHttpServer())
      .put('/cycling/weekly-goal')
      .auth(token, { type: 'bearer' })
      .send({ weeklyGoal: 90 })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('userId')
        expect(res.body.userId).toEqual(userId)
        expect(res.body).toHaveProperty('monthlyGoal')
        expect(res.body.monthlyGoal).toEqual(700)
        expect(res.body).toHaveProperty('weeklyGoal')
        expect(res.body.weeklyGoal).toEqual(90)
        expect(res.body).toHaveProperty('chores')
        expect(res.body.chores.length).toEqual(0)
      })
  })

  it('Should get proper errors for invalid weekly goal payload', () => {
    return request(app.getHttpServer())
      .put('/cycling/weekly-goal')
      .auth(token, { type: 'bearer' })
      .send({ weeklyGoal: 'a lot' })
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(2)
        expect(res.body.message).toContain(CustomValidationError.NUMBER_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.MIN_VALUE)
      })
  })

  it('Should get proper errors for invalid monthly goal payload', () => {
    return request(app.getHttpServer())
      .put('/cycling/monthly-goal')
      .auth(token, { type: 'bearer' })
      .send({ monthlyGoal: 'a lot' })
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(2)
        expect(res.body.message).toContain(CustomValidationError.NUMBER_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.MIN_VALUE)
      })
  })

  it('Should set weekly goal to null', () => {
    return request(app.getHttpServer())
      .put('/cycling/weekly-goal')
      .auth(token, { type: 'bearer' })
      .send({ weeklyGoal: null })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('weeklyGoal')
        expect(res.body.weeklyGoal).toEqual(null)
      })
  })

  it('Should add new chores', async () => {
    await request(app.getHttpServer())
      .post('/cycling/chore')
      .auth(token, { type: 'bearer' })
      .send({ name: 'chore 1', kmInterval: 200, lastKm: 362 })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('userId')
        expect(res.body.userId).toEqual(userId)
        expect(res.body).toHaveProperty('chores')
        expect(Array.isArray(res.body.chores)).toBeTruthy()
        expect(res.body.chores[0]).toHaveProperty('id')
        choreId = res.body.chores[0].id
        expect(res.body.chores[0].name).toEqual('chore 1')
        expect(res.body.chores[0].kmInterval).toEqual(200)
        expect(res.body.chores[0].lastKm).toEqual(362)
      })

    return request(app.getHttpServer())
      .post('/cycling/chore')
      .auth(token, { type: 'bearer' })
      .send({ name: 'chore 2', kmInterval: 350, lastKm: 432 })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('userId')
        expect(res.body.userId).toEqual(userId)
        expect(res.body).toHaveProperty('chores')
        expect(Array.isArray(res.body.chores)).toBeTruthy()
        expect(res.body.chores.length).toEqual(2)
        expect(res.body.chores[0]).toHaveProperty('id')
        expect(res.body.chores[0].name).toEqual('chore 2')
        expect(res.body.chores[0].kmInterval).toEqual(350)
        expect(res.body.chores[0].lastKm).toEqual(432)
      })
  })

  it('Should get proper errors for invalid chore payload', async () => {
    await request(app.getHttpServer())
      .post('/cycling/chore')
      .auth(token, { type: 'bearer' })
      .send({})
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(6)
        expect(res.body.message).toContain(CustomValidationError.NUMBER_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.STRING_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.MIN_VALUE)
        expect(res.body.message).toContain(CustomValidationError.MIN_LENGTH)
      })

    return request(app.getHttpServer())
      .put('/cycling/chore/' + choreId)
      .auth(token, { type: 'bearer' })
      .send({ lastKm: '123' })
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(6)
        expect(res.body.message).toContain(CustomValidationError.NUMBER_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.STRING_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.MIN_VALUE)
        expect(res.body.message).toContain(CustomValidationError.MIN_LENGTH)
      })
  })

  it('Should update a chore', () => {
    return request(app.getHttpServer())
      .put('/cycling/chore/' + choreId)
      .auth(token, { type: 'bearer' })
      .send({ lastKm: 562, kmInterval: 200, name: 'chore 1' })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('chores')
        expect(Array.isArray(res.body.chores)).toBeTruthy()
        expect(res.body.chores.length).toEqual(2)
        const updatedChore = res.body.chores.find(({ id }) => id === choreId)
        expect(updatedChore.lastKm).toEqual(562)
        expect(updatedChore.name).toEqual('chore 1')
        expect(updatedChore.kmInterval).toEqual(200)
      })
  })

  it('Should delete a chore', () => {
    return request(app.getHttpServer())
      .delete('/cycling/chore/' + choreId)
      .auth(token, { type: 'bearer' })
      .send()
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('chores')
        expect(Array.isArray(res.body.chores)).toBeTruthy()
        expect(res.body.chores.length).toEqual(1)
        expect(res.body.chores[0]).toHaveProperty('id')
        expect(res.body.chores[0].name).toEqual('chore 2')
        expect(res.body.chores[0].kmInterval).toEqual(350)
        expect(res.body.chores[0].lastKm).toEqual(432)
      })
  })

  it('Should get proper data after all', () => {
    return request(app.getHttpServer())
      .get('/cycling')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('userId')
        expect(res.body.userId).toEqual(userId)
        expect(res.body).toHaveProperty('monthlyGoal')
        expect(res.body.monthlyGoal).toEqual(700)
        expect(res.body).toHaveProperty('weeklyGoal')
        expect(res.body.weeklyGoal).toEqual(null)
        expect(res.body).toHaveProperty('chores')
        expect(res.body.chores.length).toEqual(1)
        const chore = res.body.chores[0]
        expect(chore.lastKm).toEqual(432)
        expect(chore.kmInterval).toEqual(350)
        expect(chore.name).toEqual('chore 2')
      })
  })
})
