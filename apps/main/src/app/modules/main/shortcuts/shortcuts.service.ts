import { Injectable } from '@angular/core'
import { Shortcut, ShortcutCategory } from '@pk-start/common'
import { Store } from '../../../utils/store'
import { ApiRoutes } from '../../shared/services/api-routes'
import { ApiService } from '../../shared/services/api.service'
import { NotificationService } from '../../shared/services/notification.service'
import { ShortcutsByCategory } from './shortcuts.types'
import { distributeShortcuts } from './shortcuts.utils'

interface ShortcutState {
  shortcuts: ShortcutsByCategory
  loading: boolean
}

const initialState: ShortcutState = {
  shortcuts: {
    [ShortcutCategory.TOP]: [],
    [ShortcutCategory.CODING]: [],
    [ShortcutCategory.GOOGLE]: [],
    [ShortcutCategory.FUN]: [],
    [ShortcutCategory.OTHERS]: [],
  },
  loading: false,
}

@Injectable({ providedIn: 'root' })
export class ShortcutsService extends Store<ShortcutState> {
  public shortcuts$ = this.select(state => state.shortcuts)
  public loading$ = this.select(state => state.loading)

  constructor(private apiService: ApiService, private notificationService: NotificationService) {
    super(initialState)
    this.fetchShortcuts()
  }

  public fetchShortcuts(): void {
    this.setState({ loading: true })
    this.apiService.get<Shortcut[]>(ApiRoutes.SHORTCUTS).subscribe({
      next: res => {
        this.setState({
          shortcuts: distributeShortcuts(res),
          loading: false,
        })
      },
      error: err => {
        this.notificationService.showError('Could not fetch notes. ' + err.message)
        this.setState({ loading: false })
      },
    })
  }
}
