import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { LoginResponse } from '@pk-start/common'
import { LocalStore } from '../../utils/store'

interface AuthState {
  id: string | null
  email: string | null
  token: string | null
  expiresAt: Date | null
  isAuth: boolean
}

const initialState: AuthState = {
  email: null,
  expiresAt: null,
  id: null,
  token: null,
  isAuth: false,
}

@Injectable()
export class AuthStore extends LocalStore<AuthState> {
  public isAuth$: Observable<boolean> = this.select(state => state.isAuth)

  constructor() {
    super('pk-start-auth', initialState)
  }

  public get isAuth(): boolean {
    return this.state.isAuth
  }

  public get current(): AuthState {
    return this.state
  }

  public setLogin(res: LoginResponse): void {
    this.setState({
      id: res.id,
      email: res.email,
      token: res.token,
      expiresAt: res.expiresAt,
      isAuth: true,
    })
  }

  public setLogout(): void {
    this.setState({
      id: null,
      email: null,
      token: null,
      expiresAt: null,
      isAuth: false,
    })
  }
}
