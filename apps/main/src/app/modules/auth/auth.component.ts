import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from './auth.service'

@Component({
  selector: 'pk-auth',
  template: `
    <div class="auth">
      <div class="container">
        <pk-logo
          size="75%"
          mainColor="var(--color-bg-dark)"
          glow="var(--color-primary)"
          opacity="0.5"
        ></pk-logo>
        <ng-container *ngIf="step === 0">
          <mat-form-field appearance="outline" color="primary">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="email" (keyup.enter)="onRequestLoginCode()" />
            <button
              matSuffix
              mat-icon-button
              color="primary"
              [disabled]="!email.length"
              (click)="onRequestLoginCode()"
            >
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-form-field>
          <p>
            <small>
              <a [routerLink]="" (click)="step = 1">I already have a login code</a>
            </small>
          </p>
        </ng-container>
        <ng-container *ngIf="step === 1">
          <mat-form-field appearance="outline" color="primary">
            <mat-label>Login code</mat-label>
            <input matInput type="text" [(ngModel)]="loginCode" (keyup.enter)="onLogin()" />
            <button
              matSuffix
              mat-icon-button
              color="primary"
              [disabled]="loginCode.length !== 6"
              (click)="onLogin()"
            >
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-form-field>
          <p>
            <small>
              <a [routerLink]="" (click)="step = 0">I need a new login code</a>
            </small>
          </p>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .auth {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        width: 100%;
        max-width: 400px;
        text-align: center;
      }
      mat-form-field {
        width: 350px;
        max-width: 90%;
      }
    `,
  ],
})
export class AuthComponent {
  public email = ''
  public loginCode = ''
  public step = 0

  constructor(private authService: AuthService, private router: Router) {}

  public onRequestLoginCode(): void {
    this.step = 1
  }

  public onLogin(): void {
    this.authService.isAuth = true
    this.router.navigate(['/']).then()
  }
}
