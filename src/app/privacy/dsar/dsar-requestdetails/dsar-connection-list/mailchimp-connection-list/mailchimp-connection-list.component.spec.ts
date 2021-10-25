import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailchimpConnectionListComponent } from './mailchimp-connection-list.component';

describe('MailchimpConnectionListComponent', () => {
  let component: MailchimpConnectionListComponent;
  let fixture: ComponentFixture<MailchimpConnectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailchimpConnectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailchimpConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
