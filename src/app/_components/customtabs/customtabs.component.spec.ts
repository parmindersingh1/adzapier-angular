import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomtabsComponent } from './customtabs.component';

describe('CustomtabsComponent', () => {
  let component: CustomtabsComponent;
  let fixture: ComponentFixture<CustomtabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomtabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomtabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
