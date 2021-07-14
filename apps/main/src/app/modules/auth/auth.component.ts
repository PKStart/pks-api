import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from './auth.service'

@Component({
  selector: 'pk-auth',
  template: `
    <div class="auth">
      <div class="bg-container">
        <pk-logo
          pkFullSize
          size="100%"
          mainColor="var(--color-bg-dark)"
          glow="var(--color-primary)"
          opacity="0.5"
        ></pk-logo>
      </div>
      <div>
        <h1>Login</h1>
        <p>
          <button mat-button color="primary" (click)="onLogin()">Login</button>
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .auth {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bg-container {
        position: absolute;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class AuthComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.isAuth = true
    this.router.navigate(['/']).then()
  }
}
