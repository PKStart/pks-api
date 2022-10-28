import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { DataSource, DataSourceOptions, Repository } from 'typeorm'
import { cleanup } from '../seeding'
import { AppModule } from '../src/app.module'
import { INestApplication } from '@nestjs/common'
import { CustomApiError, CustomValidationError, UUID } from 'pks-common'
import { NoteEntity } from '../src/notes/note.entity'
import { PersonalDataEntity } from '../src/personal-data/personal-data.entity'
import { ShortcutEntity } from '../src/shortcuts/shortcut.entity'
import { UserEntity } from '../src/users/user.entity'
import {
  data1,
  data2,
  note1,
  note2,
  shortcut1,
  shortcut2,
  testUser,
  userSettings,
} from './test-data'
import ormConfig from '../ormconfig'
import { CyclingEntity } from '../src/cycling/cycling.entity'

describe('UserController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let loginCode: string
  let token: string
  let userId: UUID
  let userRepository: Repository<UserEntity>
  let countBeforeSignup: number

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dataSource = new DataSource(ormConfig as DataSourceOptions)
    await dataSource.initialize()
    userRepository = dataSource.getRepository(UserEntity)
    countBeforeSignup = await userRepository.count()
  })

  afterAll(async () => {
    await cleanup(dataSource)
    await dataSource.destroy()
    await app.close()
  })

  it('Should sign a user up', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send(testUser)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        userId = res.body.id
      })
      .then(async () => {
        const count = await userRepository.count()
        expect(count).toEqual(countBeforeSignup + 1)
      })
  })

  it('Should fail to sign a user up with the same email', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send(testUser)
      .expect(409)
      .expect(res => {
        expect(res.body.message).toBe(CustomApiError.EMAIL_REGISTERED)
      })
  })

  it('Should fail to sign a user up with invalid email', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({ name: testUser.name, email: 'asd.com' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(CustomValidationError.INVALID_EMAIL)
      })
  })

  it('Should fail to sign a user up without a name', () => {
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: testUser.email })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(CustomValidationError.STRING_REQUIRED)
      })
  })

  it('Should get a valid loginCode', () => {
    return request(app.getHttpServer())
      .post('/users/debug/login-code')
      .send({ email: testUser.email })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('loginCode')
        expect(typeof res.body.loginCode).toBe('string')
        loginCode = res.body.loginCode
      })
  })

  it('Should get 404 with non-registered email', () => {
    return request(app.getHttpServer())
      .post('/users/debug/login-code')
      .send({ email: testUser.email + 'asd' })
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(CustomApiError.USER_NOT_FOUND)
      })
  })

  it('Should successfully log in with a loginCode', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({ email: testUser.email, loginCode })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('expiresAt')
        expect(res.body).toHaveProperty('email')
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('settings')
        expect(res.body.email).toEqual(testUser.email)
        expect(res.body.settings.weatherApiKey).toBeNull()
        expect(res.body.settings.locationApiKey).toBeNull()
        expect(res.body.settings.shortcutIconBaseUrl).toBeNull()
        expect(res.body.settings.birthdaysUrl).toBeNull()
        expect(res.body.settings.koreanUrl).toBeNull()
        expect(res.body.settings.stravaClientId).toBeNull()
        expect(res.body.settings.stravaClientSecret).toBeNull()
        expect(res.body.settings.stravaRedirectUri).toBeNull()
        expect(res.body.id).toEqual(userId)
        token = res.body.token
      })
  })

  it('Should fail to log in with an invalid loginCode format', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({ email: testUser.email, loginCode: 'ABC123' })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(CustomValidationError.INVALID_LOGIN_CODE)
      })
  })

  it('Should fail to log in with an wrong loginCode', () => {
    return request(app.getHttpServer())
      .post('/users/login')
      .send({ email: testUser.email, loginCode: '123123' })
      .expect(401)
      .expect(res => {
        expect(res.body.message).toContain(CustomValidationError.INVALID_LOGIN_CODE)
      })
  })

  it('Should fail to log in with an expired loginCode', async () => {
    const user = await userRepository.findOne({ where: { id: userId } })
    await userRepository.update(
      { id: userId },
      {
        ...user,
        loginCodeExpires: new Date('2021.06.25.'),
      }
    )

    return request(app.getHttpServer())
      .post('/users/login')
      .send({ email: testUser.email, loginCode })
      .expect(401)
      .expect(res => {
        expect(res.body.message).toContain(CustomApiError.EXPIRED_LOGIN_CODE)
      })
  })

  it('Should fail to refresh the access token without a token :)', () => {
    return request(app.getHttpServer()).post('/users/token-refresh').send({ userId }).expect(401)
  })

  it('Should fail to refresh the access token without a userId', () => {
    return request(app.getHttpServer())
      .post('/users/token-refresh')
      .auth(token, { type: 'bearer' })
      .expect(403)
  })

  it('Should refresh the access token', async () => {
    // wait to avoid the new token being the same as the previous one (expiry in same second)
    await new Promise(r => setTimeout(r, 1000))
    return request(app.getHttpServer())
      .post('/users/token-refresh')
      .auth(token, { type: 'bearer' })
      .send({ userId })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('expiresAt')
        expect(typeof res.body.token).toBe('string')
        expect(res.body.token).not.toEqual(token)
      })
  })

  it('Should be able to add user settings', async () => {
    return request(app.getHttpServer())
      .post('/users/settings')
      .auth(token, { type: 'bearer' })
      .send({ ...userSettings })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('weatherApiKey')
        expect(res.body).toHaveProperty('shortcutIconBaseUrl')
        expect(res.body.weatherApiKey).toEqual('weatherApiKey')
        expect(res.body.locationApiKey).toEqual('locationApiKey')
        expect(res.body.shortcutIconBaseUrl).toEqual('https://icons.com')
        expect(res.body.birthdaysUrl).toEqual('birthdaysUrl')
        expect(res.body.koreanUrl).toEqual('koreanUrl')
        expect(res.body.stravaClientId).toEqual('123123')
        expect(res.body.stravaClientSecret).toEqual('stravaClientSecret')
        expect(res.body.stravaRedirectUri).toEqual('https://redirect.uri')
      })
  })

  it('Should get new settings after login', async () => {
    const user = await userRepository.findOne({ where: { id: userId } })
    await userRepository.update(
      { id: userId },
      {
        ...user,
        loginCodeExpires: new Date('2099.06.25.'),
      }
    )
    return request(app.getHttpServer())
      .post('/users/login')
      .send({ email: testUser.email, loginCode })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('settings')
        expect(res.body.settings.weatherApiKey).toEqual('weatherApiKey')
        expect(res.body.settings.shortcutIconBaseUrl).toEqual('https://icons.com')
      })
  })

  it('Should fail to delete a user if not authenticated', () => {
    return request(app.getHttpServer()).delete('/users').expect(401)
  })

  it('Should delete a user and all its related entities', async () => {
    const shortcutRepository = dataSource.getRepository(ShortcutEntity)
    const numberOfShortcutsBefore = await shortcutRepository.count({ where: { userId } })
    const noteRepository = dataSource.getRepository(NoteEntity)
    const numberOfNotesBefore = await noteRepository.count({ where: { userId } })
    const personalDataRepository = dataSource.getRepository(PersonalDataEntity)
    const numberOfDataBefore = await personalDataRepository.count({ where: { userId } })
    const cyclingRepository = dataSource.getRepository(CyclingEntity)
    const hasCyclingData = !!(await cyclingRepository.findOne({ where: { userId } }))
    expect(hasCyclingData).toBeFalsy()

    await request(app.getHttpServer())
      .post('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send(shortcut1)
      .expect(201)
    await request(app.getHttpServer())
      .post('/shortcuts')
      .auth(token, { type: 'bearer' })
      .send(shortcut2)
      .expect(201)

    await request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: 'bearer' })
      .send(note1)
      .expect(201)
    await request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: 'bearer' })
      .send(note2)
      .expect(201)

    await request(app.getHttpServer())
      .post('/personal-data')
      .auth(token, { type: 'bearer' })
      .send(data1)
      .expect(201)
    await request(app.getHttpServer())
      .post('/personal-data')
      .auth(token, { type: 'bearer' })
      .send(data2)
      .expect(201)

    await request(app.getHttpServer())
      .put('/cycling/weekly-goal')
      .auth(token, { type: 'bearer' })
      .send({ weeklyGoal: 70 })
      .expect(200)

    // For some strange reason repository.count() did not work here... ¯\_(ツ)_/¯
    const shortcuts = await shortcutRepository.find({ where: { userId } })
    const notes = await noteRepository.find({ where: { userId } })
    const data = await personalDataRepository.find({ where: { userId } })
    const hasCyclingDataAfterAdd = !!(await cyclingRepository.findOne({ where: { userId } }))
    expect(hasCyclingDataAfterAdd).toBeTruthy()
    const numberOfShortcutsAfterAdd = shortcuts.length
    expect(numberOfShortcutsAfterAdd).toEqual(numberOfShortcutsBefore + 2)
    const numberOfNotesAfterAdd = notes.length
    expect(numberOfNotesAfterAdd).toEqual(numberOfNotesBefore + 2)
    const numberOfDataAfterAdd = data.length
    expect(numberOfDataAfterAdd).toEqual(numberOfDataBefore + 2)

    return request(app.getHttpServer())
      .delete('/users')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(async () => {
        const user = await userRepository.findOne({ where: { email: testUser.email } })
        expect(user).toBeNull()
        const count = await userRepository.count()
        expect(count).toEqual(countBeforeSignup)

        const numberOfShortcutsAfter = await shortcutRepository.count({ where: { userId } })
        expect(numberOfShortcutsAfter).toEqual(numberOfShortcutsBefore)
        const numberOfNotesAfter = await noteRepository.count({ where: { userId } })
        expect(numberOfNotesAfter).toEqual(numberOfNotesBefore)
        const numberOfDataAfter = await personalDataRepository.count({ where: { userId } })
        expect(numberOfDataAfter).toEqual(numberOfDataBefore)
        const hasCyclingDataAfterDelete = !!(await cyclingRepository.findOne({ where: { userId } }))
        expect(hasCyclingDataAfterDelete).toBeFalsy()
      })
  })
})
