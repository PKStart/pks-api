import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  constructor() {}

  public showError(message: string): void {
    // TODO implementation
    console.error('[Snackbar error]', message)
  }
}
