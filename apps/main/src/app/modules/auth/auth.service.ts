import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { LoginCodeRequest, LoginRequest, LoginResponse } from '@pk-start/common'
import { tap } from 'rxjs/operators'
import { ApiRoutes } from '../shared/services/api-routes'
import { ApiService } from '../shared/services/api.service'
import { AuthState, AuthStore } from './auth.store'

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private authStore: AuthStore, private api: ApiService) {}

  public get store(): AuthState {
    return Object.freeze({ ...this.authStore.current })
  }

  public requestLoginCode(email: string): Observable<void> {
    this.authStore.setEmail(email)
    if (email === 'main@test.com') return of(undefined) // for testing purposes, since email authentication is hard to test
    return this.api.post<LoginCodeRequest, void>(ApiRoutes.USERS_LOGIN_CODE, { email })
  }

  public login(loginCode: string): Observable<LoginResponse> {
    const email = this.authStore.current.email
    if (!email) {
      throw new Error('Email was not saved in store!')
    }
    return this.api
      .post<LoginRequest, LoginResponse>(ApiRoutes.USERS_LOGIN, { email, loginCode })
      .pipe(
        tap((res: LoginResponse) => {
          this.authStore.setLogin(res)
          // TODO schedule token refresh
        })
      )
  }

  public logout(): void {
    this.authStore.setLogout()
    // TODO clear token refresh
  }
}
