import { Injectable } from '@angular/core'
import { UserSettings } from '@pk-start/common'
import { StoreKeys } from '../../../constants/constants'
import { LocalStore } from '../../../utils/store'

const initialState: UserSettings = {
  shortcutIconBaseUrl: null,
  weatherApiKey: null,
}

@Injectable({ providedIn: 'root' })
export class SettingsStore extends LocalStore<UserSettings> {
  constructor() {
    super(StoreKeys.SETTINGS, initialState)
  }

  public get weatherApiKey(): string | null {
    return this.state.weatherApiKey
  }

  public get shortcutIconBaseUrl(): string | null {
    return this.state.shortcutIconBaseUrl
  }

  public setSettings(settings: UserSettings): void {
    this.setState(settings)
  }
}
