import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsarSystemComponent } from './dsar-system.component';

describe('DsarSystemComponent', () => {
  let component: DsarSystemComponent;
  let fixture: ComponentFixture<DsarSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsarSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsarSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
