import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DataSource, DataSourceOptions, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanup } from '../seeding'
import { AppModule } from '../src/app.module'
import { ShortcutEntity } from '../src/shortcuts/shortcut.entity'
import { signupAndLogin } from './commands/handle-user'
import { CustomApiError, CustomValidationError } from 'pks-common'
import { shortcut1, shortcut2, shortcut3, testUser, testUser2 } from './test-data'
import ormConfig from '../ormconfig'

describe('ShortcutController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let shortcutRepository: Repository<ShortcutEntity>
  let token: string
  let tokenOther: string
  let userId: string
  let shortcutId: string
  let countBeforeAll: number

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dataSource = new DataSource(ormConfig as DataSourceOptions)
    await dataSource.initialize()
    shortcutRepository = dataSource.getRepository(ShortcutEntity)

    countBeforeAll = await shortcutRepository.count()

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

  it('Should receive 404 for getting shortcuts for a new user', () => {
    return request(app.getHttpServer())
      .get('/shortcuts')
      .auth(token, { type: 'bearer' })
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(CustomApiError.ITEM_NOT_FOUND)
      })
  })

  it('Should create a new shortcut', () => {
    return request(app.getHttpServer())
      .post('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send(shortcut1)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        shortcutId = res.body.id
      })
  })

  it('Should create a second new shortcut', () => {
    return request(app.getHttpServer())
      .post('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send(shortcut2)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
      })
      .then(async () => {
        const count = await shortcutRepository.count()
        expect(count).toEqual(countBeforeAll + 2)
      })
  })

  it('Should sign up a new user and create a shortcut', async () => {
    return request(app.getHttpServer())
      .post('/shortcuts')
      .auth(tokenOther, { type: 'bearer' })
      .send(shortcut3)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
      })
      .then(async () => {
        const count = await shortcutRepository.count()
        expect(count).toEqual(countBeforeAll + 3)
      })
  })

  it('Should get a list of proper objects only for the current user', async () => {
    const totalCount = await shortcutRepository.count()
    expect(totalCount).toEqual(countBeforeAll + 3)

    return request(app.getHttpServer())
      .get('/shortcuts')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toEqual(2)
        expect(res.body.map(i => i.id)).toContain(shortcutId)
        expect(res.body.map(i => i.userId).every(id => id === userId)).toBeTruthy()
        res.body.forEach(item => {
          expect(item).toHaveProperty('id')
          expect(item).toHaveProperty('userId')
          expect(item).toHaveProperty('name')
          expect(item).toHaveProperty('url')
          expect(item).toHaveProperty('iconUrl')
          expect(item).toHaveProperty('priority')
          expect(item).toHaveProperty('category')
        })
      })
  })

  it('Should get proper errors for invalid create object', () => {
    return request(app.getHttpServer())
      .post('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'a',
        url: 'no-url',
        iconUrl: null,
        category: 'SOMETHING',
        priority: '3',
      })
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(8)
        expect(res.body.message).toContain(CustomValidationError.MIN_LENGTH)
        expect(res.body.message).toContain(CustomValidationError.INVALID_URL)
        expect(res.body.message).toContain(CustomValidationError.INVALID_CATEGORY)
        expect(res.body.message).toContain(CustomValidationError.MAX_VALUE)
        expect(res.body.message).toContain(CustomValidationError.MAX_VALUE)
        expect(res.body.message).toContain(CustomValidationError.NUMBER_REQUIRED)
        expect(res.body.message).toContain(CustomValidationError.STRING_REQUIRED)
      })
  })

  it('Should fail to update without item id', () => {
    return request(app.getHttpServer())
      .put('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send(shortcut1)
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
      .put('/shortcuts')
      .auth(tokenOther, { type: 'bearer' })
      .send({ id: shortcutId, ...shortcut1 })
      .expect(403)
  })

  it('Should fail to update a non existing item', () => {
    return request(app.getHttpServer())
      .put('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send({ id: uuid(), ...shortcut1 })
      .expect(404)
  })

  it("Should fail to delete an other user's item", () => {
    return request(app.getHttpServer())
      .delete('/shortcuts')
      .auth(tokenOther, { type: 'bearer' })
      .send({ id: shortcutId })
      .expect(403)
  })

  it('Should fail to delete a non existing item', () => {
    return request(app.getHttpServer())
      .delete('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send({ id: uuid() })
      .expect(404)
  })

  it('Should successfully update an item', async () => {
    await request(app.getHttpServer())
      .put('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send({
        ...shortcut1,
        id: shortcutId,
        name: 'New name',
        priority: 5,
      })
      .expect(200)

    return request(app.getHttpServer())
      .get('/shortcuts')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        const item = res.body.find(i => i.id === shortcutId)
        expect(item).toBeDefined()
        expect(item.name).toEqual('New name')
        expect(item.priority).toEqual(5)
      })
  })

  it('Should successfully delete an item', async () => {
    await request(app.getHttpServer())
      .delete('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send({ id: shortcutId })
      .expect(200)

    return request(app.getHttpServer())
      .get('/shortcuts')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toEqual(1)
      })
      .then(async () => {
        const count = await shortcutRepository.count()
        expect(count).toEqual(countBeforeAll + 2)
      })
  })
})
