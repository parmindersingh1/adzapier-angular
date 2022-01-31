import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomcardsComponent } from './customcards.component';

describe('CustomcardsComponent', () => {
  let component: CustomcardsComponent;
  let fixture: ComponentFixture<CustomcardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomcardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
