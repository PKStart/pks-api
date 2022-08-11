import { INestApplication } from '@nestjs/common'
import { User, UUID } from 'pks-common'
import * as request from 'supertest'

export async function signupAndLogin(
  app: INestApplication,
  user: Partial<User>
): Promise<{ token: string; userId: UUID }> {
  const { id } = await request(app.getHttpServer())
    .post('/users/signup')
    .send(user)
    .then(res => res.body)
  const { loginCode } = await request(app.getHttpServer())
    .post('/users/debug/login-code')
    .send({ email: user.email })
    .then(res => res.body)
  const { token } = await request(app.getHttpServer())
    .post('/users/login')
    .send({ email: user.email, loginCode })
    .then(res => res.body)
  return { userId: id, token }
}

export async function deleteUser(app: INestApplication, token: string): Promise<void> {
  await request(app.getHttpServer()).delete('/users').auth(token, { type: 'bearer' })
}
