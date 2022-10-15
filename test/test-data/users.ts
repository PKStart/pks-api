import { User } from 'pks-common'
import { UserSettings } from '../../src/users/user.dto'

export const testUser: Partial<User> = {
  email: 'test1@test.com',
  name: 'Test User',
}

export const testUser2: Partial<User> = {
  email: 'test2@test.com',
  name: 'Test User 2',
}

export const userSettings: UserSettings = {
  shortcutIconBaseUrl: 'https://icons.com',
  weatherApiKey: 'weatherApiKey',
  locationApiKey: 'locationApiKey',
  birthdaysUrl: 'birthdaysUrl',
  koreanUrl: 'koreanUrl',
  stravaClientId: '123123',
  stravaClientSecret: 'stravaClientSecret',
  stravaRedirectUri: 'https://redirect.uri',
}
