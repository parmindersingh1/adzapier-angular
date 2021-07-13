import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentSetupComponent } from './consent-setup.component';

describe('ConsentSetupComponent', () => {
  let component: ConsentSetupComponent;
  let fixture: ComponentFixture<ConsentSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
