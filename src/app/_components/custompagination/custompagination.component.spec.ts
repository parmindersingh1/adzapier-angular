import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustompaginationComponent } from './custompagination.component';

describe('CustompaginationComponent', () => {
  let component: CustompaginationComponent;
  let fixture: ComponentFixture<CustompaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustompaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustompaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
