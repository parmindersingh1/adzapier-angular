import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PagesettingsComponent } from './pagesettings.component';

describe('PagesettingsComponent', () => {
  let component: PagesettingsComponent;
  let fixture: ComponentFixture<PagesettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
