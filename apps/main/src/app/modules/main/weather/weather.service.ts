import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs'
import { SettingsStore } from '../../shared/services/settings.store'

export interface LocationIqResponse {
  address: {
    city: string
    district?: string
  }
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private locationApiKey: string | null = null
  private weatherApiKey: string | null = null
  private location = new BehaviorSubject<string>('')
  public location$ = this.location.asObservable()
  private weather = new BehaviorSubject<string>('')
  public weather$ = this.weather.asObservable()

  constructor(private http: HttpClient, private settingsStore: SettingsStore) {
    settingsStore.apiKeys.subscribe(keys => {
      this.weatherApiKey = keys.weatherApiKey ?? null
      this.locationApiKey = keys.locationApiKey ?? null
    })
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.onBrowserPosition.bind(this),
        this.onBrowserPositionError.bind(this)
      )
    }
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
        error: err => this.onGetLocationError(err),
      })
  }

  private onBrowserPosition(position: GeolocationPosition): void {
    console.log('position', position)
    this.getLocation(position.coords)
  }
  private onBrowserPositionError(error: GeolocationPositionError): void {
    // TODO Handle error
    console.log('position error', error.message)
  }

  private onGetLocation(location: LocationIqResponse, coords: GeolocationCoordinates): void {
    this.location.next(
      location.address.city + (location.address.district ? `, ${location.address.district}` : '')
    )
    if (!this.weatherApiKey) return
    this.http
      .get('https://api.openweathermap.org/data/2.5/onecall', {
        params: {
          lat: coords.latitude,
          lon: coords.longitude,
          appId: this.weatherApiKey,
          exclude: 'minutely',
          units: 'metric',
        },
      })
      .subscribe({
        next: (res: any) => {
          console.log('weather res', res)
          this.weather.next(res.current.weather[0].description)
        },
        error: err => {
          console.log('weather err', err)
        },
      })
  }
  private onGetLocationError(error: HttpErrorResponse): void {
    // TODO Handle error
    console.log('location error', error.message)
  }
}
