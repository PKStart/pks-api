import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LogoComponent } from './components/logo.component'
import { FullSizeDirective } from './directives/fullSize.directive'
import { AngularMaterialModule } from './material.module'

@NgModule({
  imports: [
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
  ],
  exports: [
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    LogoComponent,
    FullSizeDirective,
  ],
  declarations: [LogoComponent, FullSizeDirective],
  providers: [],
})
export class SharedModule {}
