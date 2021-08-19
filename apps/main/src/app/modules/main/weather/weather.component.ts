import { Component, OnDestroy } from '@angular/core'
import { differenceInMinutes } from 'date-fns'
import { Subscription } from 'rxjs'
import { AppBarService } from '../app-bar/app-bar.service'
import { WeatherService } from './weather.service'

@Component({
  selector: 'pk-weather',
  template: `
    <div class="main-box">
      <div class="main-box-header">
        <h1 class="main-box-title">Weather</h1>
        <div class="main-box-actions">
          <button
            mat-icon-button
            [matTooltip]="updatedText"
            matTooltipPosition="left"
            (click)="refetch()"
            [disabled]="loading$ | async"
          >
            <mat-icon>sync</mat-icon>
          </button>
          <button mat-icon-button (click)="appBarService.toggleWeather()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
      <div *ngIf="loading$ | async" class="main-box-loading">
        <mat-spinner diameter="32" color="accent"></mat-spinner>
      </div>
      <pk-current-weather></pk-current-weather>
    </div>
  `,
  styles: [],
})
export class WeatherComponent implements OnDestroy {
  public updatedText = 'Updated just now'
  public loading$ = this.weatherService.loading$

  private updatedMinutes = 0
  private updatedTimer = 0
  private subscription = new Subscription()

  constructor(private weatherService: WeatherService, public appBarService: AppBarService) {
    this.subscription.add(
      weatherService.weather$.subscribe(weather => {
        if (!weather) return
        clearInterval(this.updatedTimer)
        this.updatedMinutes = differenceInMinutes(new Date(), weather.lastUpdated)
        this.setUpdatedText()
        this.updatedTimer = setInterval(() => this.setUpdatedText(), 1000 * 60)
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    clearInterval(this.updatedTimer)
  }

  public refetch(): void {
    this.weatherService.refetchWeather()
  }

  private setUpdatedText(): void {
    this.updatedText =
      this.updatedMinutes++ < 1 ? 'Updated just now' : `Updated ${this.updatedMinutes} minutes ago`
  }
}