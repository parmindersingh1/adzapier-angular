import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GDPRComponent } from './gdpr.component';

describe('GDPRComponent', () => {
  let component: GDPRComponent;
  let fixture: ComponentFixture<GDPRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GDPRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GDPRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
