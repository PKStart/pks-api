import { Component } from '@angular/core'
import { AuthService } from './modules/auth/auth.service'
import { ApiWakeupService } from './modules/shared/services/api-wakeup.service'

@Component({
  selector: 'pk-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(private authService: AuthService, private apiWakeupService: ApiWakeupService) {
    apiWakeupService.wakeUp().subscribe({
      next: res => console.log(res.result),
      error: err => console.log('API wakeup failed', err), // TODO handle error
    })
    authService.autoLogin()
  }
}
