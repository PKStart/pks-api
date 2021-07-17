import { Component } from '@angular/core'
import { environment } from '../../../environments/environment'
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'pk-main',
  template: `
    <div class="content">
      <h1>Welcome to {{ title }}!</h1>
      <button mat-flat-button color="primary" (click)="onClick()">GO</button>
      <button mat-flat-button color="accent" (click)="onClick()">GO</button>
      <button mat-flat-button color="warn" (click)="onLogout()">GO</button>
      <span class="title">{{ title }} app is running!</span>
      <img
        width="300"
        alt="Angular Logo"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
      />
    </div>
    <mat-card>
      <mat-card-title>Card title</mat-card-title>
    </mat-card>
  `,
  styles: [
    //language=scss
    `
      $myColor: darkred;

      .content {
        text-align: center;

        .title {
          display: block;
          color: $myColor;
        }
      }
    `,
  ],
})
export class MainComponent {
  title = 'main'

  public list: string[]

  constructor(private authService: AuthService) {
    this.list = ['null']
    console.log(this.list)
    console.log(environment.PK_TEST)
  }

  onClick() {
    const lightThemeClass = 'pk-light-theme'
    document.body.classList.contains(lightThemeClass)
      ? document.body.classList.remove(lightThemeClass)
      : document.body.classList.add(lightThemeClass)
  }

  onLogout() {
    this.authService.logout()
    location.reload()
  }
}
