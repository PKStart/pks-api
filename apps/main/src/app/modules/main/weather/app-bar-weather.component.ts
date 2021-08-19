import { Component } from '@angular/core'
import { combineLatest } from 'rxjs'
import {
  CurrentWeather,
  HIGH_TEMP_WARNING_THRESHOLD,
  LOW_TEMP_WARNING_THRESHOLD,
} from './weather.types'
import { WeatherService } from './weather.service'

@Component({
  selector: 'pk-app-bar-weather',
  template: `
    <button mat-button class="wrapper" [matTooltip]="summary" (click)="onClick()">
      <ng-container *ngIf="!weather">
        <mat-icon>block</mat-icon>
      </ng-container>
      <ng-container *ngIf="weather">
        <mat-icon
          *ngIf="(weather.temperature ?? 0) > thresholds.high"
          class="weather-icon temp-high-warning"
          svgIcon="tempHighWarning"
        ></mat-icon>
        <mat-icon
          *ngIf="(weather.temperature ?? 0) < thresholds.low"
          class="weather-icon temp-low-warning"
          svgIcon="tempLowWarning"
        ></mat-icon>
        <span class="temperature">{{ weather.temperature }}&deg;C</span>
        <mat-icon class="weather-icon" [svgIcon]="weather.icon ?? ''"></mat-icon>
      </ng-container>
    </button>
  `,
  styles: [
    `
      .wrapper {
        display: flex;
        align-items: center;
        padding: 0;
      }
      .temp-high-warning {
        color: var(--color-warn);
      }
      .temp-low-warning {
        color: var(--color-primary);
      }
      .weather-icon,
      .temperature {
        padding: 0.5rem;
      }
    `,
  ],
})
export class AppBarWeatherComponent {
  public thresholds = {
    high: HIGH_TEMP_WARNING_THRESHOLD,
    low: LOW_TEMP_WARNING_THRESHOLD,
  }
  public weather: CurrentWeather | undefined
  public summary: string = 'No weather data'

  constructor(private weatherService: WeatherService) {
    combineLatest([weatherService.location$, weatherService.weather$]).subscribe(
      ([location, weather]) => {
        if (!location || !weather) return
        this.summary = `${location}: ${weather.current.description}`
        this.weather = weather.current
        console.log('weather', weather)
      }
    )
  }

  public onClick(): void {
    console.log('Weather clicked / open weather widget')
  }
}
