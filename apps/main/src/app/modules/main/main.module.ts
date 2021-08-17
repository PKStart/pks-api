import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { MainComponent } from './main.component'
import { AppBarComponent } from './app-bar/app-bar.component'
import { AppBarWeatherComponent } from './weather/app-bar-weather.component'

@NgModule({
  imports: [SharedModule],
  exports: [],
  declarations: [MainComponent, AppBarComponent, AppBarWeatherComponent],
  providers: [],
})
export class MainModule {}
