import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAppOnlyAlphanumeric]',
  standalone: true
})
export class AppOnlyAlphanumericDirective {
  constructor() { }
  @HostListener('input', ['$event']) onInput(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
  }

}
