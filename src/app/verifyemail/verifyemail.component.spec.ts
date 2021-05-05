import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VerifyemailComponent } from './verifyemail.component';

describe('VerifyemailComponent', () => {
  let component: VerifyemailComponent;
  let fixture: ComponentFixture<VerifyemailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
