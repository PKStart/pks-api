import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { AppBarComponent } from './app-bar/app-bar.component'

import { MainComponent } from './main.component'

@NgModule({
  imports: [SharedModule],
  exports: [],
  declarations: [MainComponent, AppBarComponent],
  providers: [],
})
export class MainModule {}
