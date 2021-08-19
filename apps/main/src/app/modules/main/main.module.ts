import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { MainComponent } from './main.component'
import { AppBarComponent } from './app-bar/app-bar.component'
import { AppBarWeatherComponent } from './weather/app-bar-weather.component'
import { CurrentWeatherComponent } from './weather/current-weather.component'
import { WeatherComponent } from './weather/weather.component'

@NgModule({
  imports: [SharedModule],
  exports: [],
  declarations: [
    MainComponent,
    AppBarComponent,
    AppBarWeatherComponent,
    WeatherComponent,
    CurrentWeatherComponent,
  ],
  providers: [],
})
export class MainModule {}
