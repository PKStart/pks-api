import { Component } from '@angular/core'
import { AuthService } from '../auth/auth.service'
import { AppBarService } from './app-bar/app-bar.service'

@Component({
  selector: 'pk-main',
  template: `
    <pk-app-bar></pk-app-bar>
    <div class="main-content">
      <div class="main-left">notes</div>
      <div class="main-center"></div>
      <div class="main-right">
        <pk-weather *ngIf="appBarService.weatherOpen$ | async"></pk-weather>
      </div>
    </div>
  `,
  styles: [
    //language=scss
    `
      .main-content {
        width: 100%;
        height: calc(100% - 64px);
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;

        > div {
          padding: 1rem;
          width: auto;
          height: 100%;
        }

        .main-center {
          flex: 1 1 auto;
        }
      }
    `,
  ],
})
export class MainComponent {
  constructor(private authService: AuthService, public appBarService: AppBarService) {}
}
