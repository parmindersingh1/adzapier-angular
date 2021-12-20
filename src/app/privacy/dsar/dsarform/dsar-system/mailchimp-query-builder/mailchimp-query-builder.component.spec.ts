import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailchimpQueryBuilderComponent } from './mailchimp-query-builder.component';

describe('MailchimpQueryBuilderComponent', () => {
  let component: MailchimpQueryBuilderComponent;
  let fixture: ComponentFixture<MailchimpQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailchimpQueryBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailchimpQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
