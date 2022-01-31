import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendGridComponent } from './send-grid.component';

describe('SendGridComponent', () => {
  let component: SendGridComponent;
  let fixture: ComponentFixture<SendGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
