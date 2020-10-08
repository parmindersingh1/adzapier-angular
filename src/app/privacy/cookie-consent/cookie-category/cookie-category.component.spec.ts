import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieCategoryComponent } from './cookie-category.component';

describe('CookieCategoryComponent', () => {
  let component: CookieCategoryComponent;
  let fixture: ComponentFixture<CookieCategoryComponent>;

  beforeEach(async(() => {
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
