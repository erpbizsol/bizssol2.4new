// import { Directive } from '@angular/core';

// @Directive({
//   selector: '[appPanValidator]',
//   standalone: true
// })
// export class PanValidatorDirective {

//   constructor() { }

// }

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPanValidator]'
})
export class PanValidatorDirective {

  private regex: RegExp = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const input = this.el.nativeElement.value.toUpperCase();
    this.el.nativeElement.value = input;

    if (!this.regex.test(input) && input.length === 10) {
      this.el.nativeElement.setCustomValidity('Invalid PAN Number');
    } else {
      this.el.nativeElement.setCustomValidity('');
    }
  }
}

