import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartsystemComponent } from './cartsystem.component';

describe('CartsystemComponent', () => {
  let component: CartsystemComponent;
  let fixture: ComponentFixture<CartsystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartsystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
