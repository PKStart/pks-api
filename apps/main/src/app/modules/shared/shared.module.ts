import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
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
  ],
  declarations: [],
  providers: [],
})
export class SharedModule {}
