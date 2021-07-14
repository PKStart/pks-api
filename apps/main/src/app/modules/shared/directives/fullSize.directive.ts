import { Directive, ElementRef } from '@angular/core'

@Directive({
  selector: '[pkFullSize]',
})
export class FullSizeDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.width = '100%'
    el.nativeElement.style.height = '100%'
    el.nativeElement.style.maxWidth = '90%'
    el.nativeElement.style.maxHeight = '90%'
  }
}
