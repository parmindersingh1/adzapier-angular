import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzBannerComponent } from './az-banner.component';

describe('AzBannerComponent', () => {
  let component: AzBannerComponent;
  let fixture: ComponentFixture<AzBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AzBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AzBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
