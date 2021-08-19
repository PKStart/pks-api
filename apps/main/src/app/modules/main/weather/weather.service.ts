import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs'
import { SettingsStore } from '../../shared/services/settings.store'
import { SnackbarService } from '../../shared/services/snackbar.service'
import { LocationIqResponse, Weather, WeatherResponse } from './weather.types'
import { transformWeather } from './weather.utils'

@Injectable({ providedIn: 'root' })
export class WeatherService {
  /**
   * API docs:
   * LocationIQ: https://locationiq.com/docs
   * OpenWeatherMap: https://openweathermap.org/api/one-call-api
   */
  private locationApiKey: string | null = null
  private weatherApiKey: string | null = null
  private coords: GeolocationCoordinates | undefined
  private location = new BehaviorSubject<string>('')
  private weather = new BehaviorSubject<Weather | undefined>(undefined)
  private fetchTimer = 0

  public location$ = this.location.asObservable()
  public weather$ = this.weather.asObservable()

  constructor(
    private http: HttpClient,
    private settingsStore: SettingsStore,
    private snackbar: SnackbarService
  ) {
    settingsStore.apiKeys.subscribe(keys => {
      this.weatherApiKey = keys.weatherApiKey ?? null
      this.locationApiKey = keys.locationApiKey ?? null
    })
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => this.getLocation(position.coords),
        err => this.snackbar.showError(err.message)
      )
    }
  }

  public refetchWeather(): void {
    this.fetchWeather()
    this.setFetchTimer()
  }

  private getLocation(coords: GeolocationCoordinates): void {
    if (!this.locationApiKey) return
    this.http
      .get<LocationIqResponse>('https://eu1.locationiq.com/v1/reverse.php', {
        params: {
          // lat: 37.549615,
          // lon: 127.141532,
          key: this.locationApiKey,
          format: 'json',
          lat: coords.latitude,
          lon: coords.longitude,
        },
      })
      .subscribe({
        next: (res: LocationIqResponse) => this.onGetLocation(res, coords),
        error: err => this.snackbar.showError('Could not get location: ' + err.message),
      })
  }

  private onGetLocation(location: LocationIqResponse, coords: GeolocationCoordinates): void {
    this.coords = coords
    this.location.next(
      location.address.city + (location.address.district ? `, ${location.address.district}` : '')
    )
    this.fetchWeather()
    this.setFetchTimer()
  }

  private fetchWeather(): void {
    if (!this.weatherApiKey || !this.coords) return
    this.http
      .get<WeatherResponse>('https://api.openweathermap.org/data/2.5/onecall', {
        params: {
          lat: this.coords.latitude,
          lon: this.coords.longitude,
          appId: this.weatherApiKey,
          exclude: 'minutely',
          units: 'metric',
        },
      })
      .subscribe({
        next: (res: WeatherResponse) => this.onGetWeather(res),
        error: err => this.snackbar.showError('Could not get weather: ' + err.message),
      })
  }

  private onGetWeather(res: WeatherResponse): void {
    this.weather.next(transformWeather(res))
  }

  private setFetchTimer(): void {
    if (this.fetchTimer) clearInterval(this.fetchTimer)
    this.fetchTimer = setInterval(() => this.fetchWeather(), 1000 * 60 * 60)
  }
}
