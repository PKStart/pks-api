import { Component } from '@angular/core'
import { AppBarService } from './app-bar/app-bar.service'

@Component({
  selector: 'pk-main',
  template: `
    <pk-app-bar></pk-app-bar>
    <div class="main-content">
      <div class="main-left">
        <pk-notes *ngIf="appBarService.notesOpen$ | async"></pk-notes>
      </div>
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
        gap: 1rem;
        overflow-y: auto;
        padding: 1rem;

        > div {
          width: auto;
          height: auto;
          max-height: 100%;
        }

        .main-center {
          flex: 1 1 auto;
        }

        //.main-right {
        //  display: flex;
        //  flex-direction: column;
        //  flex-wrap: wrap-reverse;
        //  gap: 1rem;
        //  max-height: 100%;
        //}
      }
    `,
  ],
})
export class MainComponent {
  constructor(public appBarService: AppBarService) {}
}
