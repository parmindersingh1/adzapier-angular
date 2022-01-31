import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentSolutionComponent } from './consent-solution.component';

describe('ConsentSolutionComponent', () => {
  let component: ConsentSolutionComponent;
  let fixture: ComponentFixture<ConsentSolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentSolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
