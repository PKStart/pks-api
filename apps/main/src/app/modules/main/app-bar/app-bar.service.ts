import { Injectable } from '@angular/core'
import { StoreKeys } from '../../../constants/constants'
import { LocalStore } from '../../../utils/store'

export interface AppBarState {
  weatherOpen: boolean
  notesOpen: boolean
  birthdaysOpen: boolean
  koreanOpen: boolean
}

const initialState: AppBarState = {
  birthdaysOpen: false,
  koreanOpen: false,
  notesOpen: false,
  weatherOpen: false,
}

@Injectable({ providedIn: 'root' })
export class AppBarService extends LocalStore<AppBarState> {
  constructor() {
    super(StoreKeys.APP_BAR, initialState)
  }

  public weatherOpen$ = this.select(state => state.weatherOpen)

  public toggleWeather(): void {
    this.setState({ weatherOpen: !this.state.weatherOpen })
  }
}
