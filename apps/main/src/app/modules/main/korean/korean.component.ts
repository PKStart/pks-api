import { Component } from '@angular/core'
import { AppBarService } from '../app-bar/app-bar.service'

@Component({
  selector: 'pk-korean',
  template: `
    <div class="main-box">
      <header class="main-box-header">
        <h1 class="main-box-title">Korean</h1>
        <div class="main-box-actions">
          <!--          <button-->
          <!--            mat-icon-button-->
          <!--            matTooltip="Sync birthdays"-->
          <!--            matTooltipPosition="left"-->
          <!--            (click)="refetch()"-->
          <!--            [disabled]="(loading$ | async) || (disabled$ | async)"-->
          <!--          >-->
          <!--            <mat-icon>sync</mat-icon>-->
          <!--          </button>-->
          <button mat-icon-button matTooltip="Close" (click)="appBarService.toggleKorean()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </header>
      <main class="main-box-content">
        <!--        <div *ngIf="loading$ | async" class="main-box-loading">-->
        <!--          <mat-spinner diameter="32" color="accent"></mat-spinner>-->
        <!--        </div>-->
        <!--        <div *ngIf="disabled$ | async" class="main-box-message">Birthdays are not available.</div>-->
        <!--        <ng-container *ngIf="(loading$ | async) === false && (disabled$ | async) === false">-->
        <!--          <mat-card>-->
        <!--            <mat-card-content *ngIf="!(today$ | async)?.length">-->
        <!--              No birthdays today.-->
        <!--            </mat-card-content>-->
        <!--            <mat-card-content *ngIf="((today$ | async)?.length || 0) > 0">-->
        <!--              <h1>Birthdays today:</h1>-->
        <!--              <p *ngFor="let item of today$ | async" class="birthday-line">{{ item.name }}</p>-->
        <!--            </mat-card-content>-->
        <!--          </mat-card>-->
        <!--        </ng-container>-->
      </main>
    </div>
  `,
  styles: [``],
})
export class KoreanComponent {
  constructor(public appBarService: AppBarService) {}
}
