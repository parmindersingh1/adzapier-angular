import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickstartmenuComponent } from './quickstartmenu.component';

describe('QuickstartmenuComponent', () => {
  let component: QuickstartmenuComponent;
  let fixture: ComponentFixture<QuickstartmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickstartmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickstartmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
