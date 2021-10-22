import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickstartalertComponent } from './quickstartalert.component';

describe('QuickstartalertComponent', () => {
  let component: QuickstartalertComponent;
  let fixture: ComponentFixture<QuickstartalertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickstartalertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickstartalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
