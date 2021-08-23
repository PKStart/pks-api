import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { MainComponent } from './main.component'
import { AppBarComponent } from './app-bar/app-bar.component'
import { NoteCardComponent } from './notes/note-card.component'
import { NoteDialogComponent } from './notes/note-dialog.component'
import { NotesComponent } from './notes/notes.component'
import { AppBarWeatherComponent } from './weather/app-bar-weather.component'
import { CurrentWeatherComponent } from './weather/current-weather.component'
import { DailyWeatherComponent } from './weather/daily-weather.component'
import { HourlyWeatherComponent } from './weather/hourly-weather.component'
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
    DailyWeatherComponent,
    HourlyWeatherComponent,
    NotesComponent,
    NoteCardComponent,
    NoteDialogComponent,
  ],
  providers: [],
})
export class MainModule {}
