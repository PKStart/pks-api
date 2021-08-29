import { Component, Renderer2 } from '@angular/core'
import { LIGHT_THEME_CLASS } from '../../../constants/constants'
import { AuthService } from '../../auth/auth.service'
import { DataBackupService } from '../data-backup/data-backup.service'
import { AppBarService } from './app-bar.service'

@Component({
  selector: 'pk-app-bar',
  template: `
    <mat-toolbar>
      <a mat-icon-button matTooltip="P-kin.com" href="https://www.p-kin.com" target="_blank">
        <mat-icon class="p-logo-icon" svgIcon="pLogoColor"></mat-icon>
      </a>
      <span class="spacer"></span>
      <pk-app-bar-weather
        *ngIf="(appBarService.weatherOpen$ | async) === false"
      ></pk-app-bar-weather>
      <button
        mat-icon-button
        matTooltip="Notes"
        *ngIf="(appBarService.notesOpen$ | async) === false"
        (click)="appBarService.toggleNotes()"
      >
        <mat-icon>notes</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Korean">
        <mat-icon svgIcon="hangul"></mat-icon>
      </button>
      <button mat-icon-button matTooltip="Personal data">
        <mat-icon>find_in_page</mat-icon>
      </button>
      <button mat-icon-button matTooltip="Birthdays">
        <mat-icon matBadge="1" matBadgeColor="accent" matBadgeSize="small">today</mat-icon>
      </button>
      <pk-notifications></pk-notifications>
      <button mat-icon-button matTooltip="More..." [matMenuTriggerFor]="menu">
        <mat-icon>more_horiz</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="switchTheme()">
          <mat-icon>{{ isLightTheme ? 'dark_mode' : 'light_mode' }}</mat-icon>
          <span>{{ isLightTheme ? 'Dark theme' : 'Light theme' }}</span>
        </button>
        <button mat-menu-item (click)="requestBackup()">
          <mat-icon>cloud_download</mat-icon>
          <span>Data backup</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Log out</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [
    //language=scss
    `
      mat-toolbar {
        border-bottom: 1px solid var(--color-primary);
      }
      .p-logo-icon {
        transform: scale(1.5);
      }
      .spacer {
        flex: 1 1 auto;
      }
    `,
  ],
})
export class AppBarComponent {
  public isLightTheme = false

  constructor(
    private authService: AuthService,
    private dataBackupService: DataBackupService,
    public appBarService: AppBarService,
    private renderer: Renderer2
  ) {}

  public switchTheme(): void {
    this.isLightTheme = !this.isLightTheme
    if (this.isLightTheme) {
      this.renderer.addClass(document.body, LIGHT_THEME_CLASS)
    } else {
      this.renderer.removeClass(document.body, LIGHT_THEME_CLASS)
    }
  }

  public logout(): void {
    this.authService.logout()
    location.reload()
  }

  public requestBackup(): void {
    this.dataBackupService.sendBackupRequest()
  }
}
