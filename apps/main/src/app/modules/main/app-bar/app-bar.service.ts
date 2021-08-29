import { Injectable } from '@angular/core'
import { StoreKeys } from '../../../constants/constants'
import { LocalStore } from '../../../utils/store'

export interface AppBarState {
  weatherOpen: boolean
  notesOpen: boolean
  birthdaysOpen: boolean
  koreanOpen: boolean
  personalDataOpen: boolean
}

const initialState: AppBarState = {
  birthdaysOpen: false,
  koreanOpen: false,
  notesOpen: true,
  weatherOpen: false,
  personalDataOpen: false,
}

@Injectable({ providedIn: 'root' })
export class AppBarService extends LocalStore<AppBarState> {
  constructor() {
    super(StoreKeys.APP_BAR, initialState)
  }

  public weatherOpen$ = this.select(state => state.weatherOpen)
  public notesOpen$ = this.select(state => state.notesOpen)

  public toggleWeather(): void {
    this.setState({ weatherOpen: !this.state.weatherOpen })
  }

  public toggleNotes(): void {
    this.setState({ notesOpen: !this.state.notesOpen })
  }
}
