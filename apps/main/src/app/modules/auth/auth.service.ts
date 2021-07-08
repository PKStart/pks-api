import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class AuthService {
  public isAuth: boolean

  constructor() {
    this.isAuth = false
  }
}
