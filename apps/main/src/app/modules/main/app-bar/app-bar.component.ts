import { Component, Renderer2 } from '@angular/core'
import { AuthService } from '../../auth/auth.service'

@Component({
  selector: 'pk-app-bar',
  template: `
    <mat-toolbar>
      <a mat-icon-button matTooltip="P-kin.com" href="https://www.p-kin.com" target="_blank">
        <mat-icon svgIcon="pLogoColor"></mat-icon>
      </a>
      <span class="spacer"></span>
      <button
        mat-icon-button
        [matTooltip]="'Switch to ' + (isLightTheme ? 'dark theme' : 'light theme')"
        (click)="switchTheme()"
      >
        <mat-icon>{{ isLightTheme ? 'dark_mode' : 'light_mode' }}</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Log out" (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
      <button mat-icon-button matTooltip="More...">
        <mat-icon>more_horiz</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [
    //language=scss
    `
      mat-toolbar {
        border-bottom: 1px solid var(--color-primary);
      }
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class AppBarComponent {
  public isLightTheme = false

  constructor(private authService: AuthService, private renderer: Renderer2) {}

  public switchTheme(): void {
    this.isLightTheme = !this.isLightTheme
    if (this.isLightTheme) {
      this.renderer.addClass(document.body, 'pk-light-theme')
    } else {
      this.renderer.removeClass(document.body, 'pk-light-theme')
    }
  }

  public logout(): void {
    this.authService.logout()
    location.reload()
  }
}
