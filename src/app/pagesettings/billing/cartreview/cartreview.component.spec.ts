import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartreviewComponent } from './cartreview.component';

describe('CartreviewComponent', () => {
  let component: CartreviewComponent;
  let fixture: ComponentFixture<CartreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
