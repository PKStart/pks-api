export function getDotEnv(): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: './.env' })
}
