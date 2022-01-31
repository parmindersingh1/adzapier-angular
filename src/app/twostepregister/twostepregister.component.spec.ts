import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwostepregisterComponent } from './twostepregister.component';

describe('TwostepregisterComponent', () => {
  let component: TwostepregisterComponent;
  let fixture: ComponentFixture<TwostepregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwostepregisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwostepregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
