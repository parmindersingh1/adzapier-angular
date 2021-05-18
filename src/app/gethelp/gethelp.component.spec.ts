import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GethelpComponent } from './gethelp.component';

describe('GethelpComponent', () => {
  let component: GethelpComponent;
  let fixture: ComponentFixture<GethelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GethelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GethelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
