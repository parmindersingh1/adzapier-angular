import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WebformsComponent } from './webforms.component';

describe('WebformsComponent', () => {
  let component: WebformsComponent;
  let fixture: ComponentFixture<WebformsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WebformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check license limit available before creating form',()=>{
    expect(component.isLicenseLimitAvailable()).toBe(true);
  })

});
