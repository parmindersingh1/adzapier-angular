import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ShareIconComponent } from './ShareIconComponent';
import { h, render } from 'preact';

const containerElementName = 'shareIconComponentContainer';

@Component({
  selector: 'share-icon-component',
  template: ``,
  styleUrls: ['./ShareIconComponent.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ShareIconWrapperComponent implements OnChanges, AfterViewInit {
  @Input('align-icons') alignIcons = "left";
  @Input('link') link = window.location.origin;
  private preactEl: any;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    console.log("______ RENDER _________")
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  render() {
    this.preactEl = render(
      h(ShareIconComponent, {
        alignIcons: this.alignIcons,
        link: this.link
      }),
      this.elRef.nativeElement,
      this.preactEl
    );
  }
}
