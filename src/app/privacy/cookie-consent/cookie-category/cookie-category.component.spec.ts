import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CookieCategoryComponent } from './cookie-category.component';

describe('CookieCategoryComponent', () => {
  let component: CookieCategoryComponent;
  let fixture: ComponentFixture<CookieCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
