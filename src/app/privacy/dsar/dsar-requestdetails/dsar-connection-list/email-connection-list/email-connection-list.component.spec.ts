import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConnectionListComponent } from './email-connection-list.component';

describe('EmailConnectionListComponent', () => {
  let component: EmailConnectionListComponent;
  let fixture: ComponentFixture<EmailConnectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailConnectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
