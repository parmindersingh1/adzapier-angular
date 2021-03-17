import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentSolutionsComponent } from './consent-solutions.component';

describe('ConsentSolutionsComponent', () => {
  let component: ConsentSolutionsComponent;
  let fixture: ComponentFixture<ConsentSolutionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentSolutionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
