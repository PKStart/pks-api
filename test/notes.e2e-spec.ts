import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DataSource, DataSourceOptions, Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { cleanup } from '../seeding'
import { AppModule } from '../src/app.module'
import { NoteEntity } from '../src/notes/note.entity'
import { signupAndLogin } from './commands/handle-user'
import { CustomApiError, CustomValidationError } from 'pks-common'
import { note1, note2, note3, note4, testUser, testUser2 } from './test-data'
import ormConfig from '../ormconfig'

describe('NoteController (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let noteRepository: Repository<NoteEntity>
  let token: string
  let tokenOther: string
  let userId: string
  let noteId: string
  let countBeforeAll: number

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dataSource = new DataSource(ormConfig as DataSourceOptions)
    await dataSource.initialize()
    noteRepository = dataSource.getRepository(NoteEntity)

    countBeforeAll = await noteRepository.count()

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

  it('Should receive 404 for getting notes for a new user', () => {
    return request(app.getHttpServer())
      .get('/notes')
      .auth(token, { type: 'bearer' })
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe(CustomApiError.ITEM_NOT_FOUND)
      })
  })

  it('Should create a new note', () => {
    return request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: 'bearer' })
      .send(note1)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        noteId = res.body.id
      })
  })

  it('Should create a second new note with links', () => {
    return request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: 'bearer' })
      .send(note2)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
      })
      .then(async () => {
        const count = await noteRepository.count()
        expect(count).toEqual(countBeforeAll + 2)
      })
  })

  it('Should create a third new note without text', () => {
    return request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: 'bearer' })
      .send(note3)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
      })
      .then(async () => {
        const count = await noteRepository.count()
        expect(count).toEqual(countBeforeAll + 3)
      })
  })

  it('Should sign up a new user and create a note', async () => {
    return request(app.getHttpServer())
      .post('/notes')
      .auth(tokenOther, { type: 'bearer' })
      .send(note4)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
      })
      .then(async () => {
        const count = await noteRepository.count()
        expect(count).toEqual(countBeforeAll + 4)
      })
  })

  it('Should get a list of proper objects only for the current user', async () => {
    const totalCount = await noteRepository.count()
    expect(totalCount).toEqual(countBeforeAll + 4)

    return request(app.getHttpServer())
      .get('/notes')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toEqual(3)
        expect(res.body.map(i => i.id)).toContain(noteId)
        expect(res.body.map(i => i.userId).every(id => id === userId)).toBeTruthy()
        res.body.forEach(item => {
          expect(item).toHaveProperty('id')
          expect(item).toHaveProperty('userId')
          expect(item).toHaveProperty('archived')
          expect(item).toHaveProperty('pinned')
        })
      })
  })

  it('Should get proper errors for invalid create object #1', () => {
    return request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: 'bearer' })
      .send({
        text: 'Some text',
        links: null,
        archived: 'no',
        pinned: true,
      })
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(1)
        expect(res.body.message).toContain(CustomValidationError.BOOLEAN_REQUIRED)
      })
  })

  it('Should get proper errors for invalid create object #2', () => {
    return request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: 'bearer' })
      .send({
        text: '',
        links: null,
        archived: false,
        pinned: true,
      })
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(1)
        expect(res.body.message).toContain(CustomValidationError.TEXT_OR_LINK_REQUIRED)
      })
  })

  it('Should get proper errors for invalid create object #3', () => {
    return request(app.getHttpServer())
      .post('/notes')
      .auth(token, { type: 'bearer' })
      .send({
        text: 'Some text',
        links: [
          { name: 'asd', url: 'www.google.com' },
          { nam: 'asd', url: 'not-a-link' },
        ],
        archived: false,
        pinned: true,
      })
      .expect(400)
      .expect(res => {
        expect(Array.isArray(res.body.message)).toBeTruthy()
        expect(res.body.message.length).toEqual(2)
        expect(res.body.message).toContain(CustomValidationError.INVALID_URL)
        expect(res.body.message).toContain(CustomValidationError.STRING_REQUIRED)
      })
  })

  it('Should fail to update without item id', () => {
    return request(app.getHttpServer())
      .put('/notes')
      .auth(token, { type: 'bearer' })
      .send(note1)
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
      .put('/notes')
      .auth(tokenOther, { type: 'bearer' })
      .send({ id: noteId, ...note1 })
      .expect(403)
  })

  it('Should fail to update a non existing item', () => {
    return request(app.getHttpServer())
      .put('/notes')
      .auth(token, { type: 'bearer' })
      .send({ id: uuid(), ...note1 })
      .expect(404)
  })

  it("Should fail to delete an other user's item", () => {
    return request(app.getHttpServer())
      .delete('/notes')
      .auth(tokenOther, { type: 'bearer' })
      .send({ id: noteId })
      .expect(403)
  })

  it('Should fail to delete a non existing item', () => {
    return request(app.getHttpServer())
      .delete('/notes')
      .auth(token, { type: 'bearer' })
      .send({ id: uuid() })
      .expect(404)
  })

  it('Should successfully update an item', async () => {
    await request(app.getHttpServer())
      .put('/notes')
      .auth(token, { type: 'bearer' })
      .send({
        ...note1,
        id: noteId,
        text: 'New text',
      })
      .expect(200)

    return request(app.getHttpServer())
      .get('/notes')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        const item = res.body.find(i => i.id === noteId)
        expect(item).toBeDefined()
        expect(item.text).toEqual('New text')
      })
  })

  it('Should successfully delete an item', async () => {
    await request(app.getHttpServer())
      .delete('/notes')
      .auth(token, { type: 'bearer' })
      .send({ id: noteId })
      .expect(200)

    return request(app.getHttpServer())
      .get('/notes')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBeTruthy()
        expect(res.body.length).toEqual(2)
      })
      .then(async () => {
        const count = await noteRepository.count()
        expect(count).toEqual(countBeforeAll + 3)
      })
  })
})
