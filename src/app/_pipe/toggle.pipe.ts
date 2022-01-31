import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[toggle]'
})
export class ToggleDirective {

  constructor(private el: ElementRef) {
    const parent = this.el.nativeElement.parentNode;
    const span: any = document.createElement('span');
    span.innerHTML = '<i class="fa password-toggle-eye fa-eye" show="true" aria-hidden="true"></i>';

    span.addEventListener('click', () => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }

  toggle(span: any) {
    const isShow = span.getElementsByClassName('fa');
    if (isShow[0].classList[2] !== 'fa-eye-slash') {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = '<i class="fa password-toggle-eye fa-eye-slash" show="false" aria-hidden="true"></i>';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML =  '<i class="fa password-toggle-eye fa-eye" show="true" aria-hidden="true"></i>';
    }
  }
}
