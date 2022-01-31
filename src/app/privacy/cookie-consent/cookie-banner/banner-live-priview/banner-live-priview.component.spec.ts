import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BannerLivePriviewComponent } from './banner-live-priview.component';

describe('BannerLivePriviewComponent', () => {
  let component: BannerLivePriviewComponent;
  let fixture: ComponentFixture<BannerLivePriviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerLivePriviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerLivePriviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
