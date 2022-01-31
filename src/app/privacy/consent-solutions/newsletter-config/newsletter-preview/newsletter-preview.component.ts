import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-newsletter-preview',
  templateUrl: './newsletter-preview.component.html',
  styleUrls: ['./newsletter-preview.component.scss']
})
export class NewsletterPreviewComponent implements OnInit {
  @Input('customerBrandLogo') customerBrandLogo;
  @Input('ConfigForm') ConfigForm;
  @Input('customLanguageConfig') customLanguageConfig;
  constructor() { }

  ngOnInit(): void {
  }

}
