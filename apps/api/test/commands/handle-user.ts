import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { testUser } from '../test-data'

export async function signupAndLogin(
  app: INestApplication
): Promise<{ token: string; userId: string }> {
  const { id } = await request(app.getHttpServer())
    .post('/users/signup')
    .send(testUser)
    .then(res => res.body)
  const { loginCode } = await request(app.getHttpServer())
    .post('/users/debug/login-code')
    .send({ email: testUser.email })
    .then(res => res.body)
  const { token } = await request(app.getHttpServer())
    .post('/users/login')
    .send({ email: testUser.email, loginCode })
    .then(res => res.body)
  return { userId: id, token }
}

export async function deleteUser(app: INestApplication, token: string): Promise<void> {
  await request(app.getHttpServer()).delete('/users').auth(token, { type: 'bearer' })
}
