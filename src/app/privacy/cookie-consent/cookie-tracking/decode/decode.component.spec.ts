import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DecodeComponent } from './decode.component';

describe('DecodeComponent', () => {
  let component: DecodeComponent;
  let fixture: ComponentFixture<DecodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DecodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
