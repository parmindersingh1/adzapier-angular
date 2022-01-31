import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzPreferenceComponent } from './az-preference.component';

describe('AzPreferenceComponent', () => {
  let component: AzPreferenceComponent;
  let fixture: ComponentFixture<AzPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AzPreferenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AzPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
