import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendInBlueComponent } from './send-in-blue.component';

describe('SendInBlueComponent', () => {
  let component: SendInBlueComponent;
  let fixture: ComponentFixture<SendInBlueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendInBlueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendInBlueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
