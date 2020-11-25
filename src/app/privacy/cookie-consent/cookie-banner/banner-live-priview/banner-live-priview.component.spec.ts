import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerLivePriviewComponent } from './banner-live-priview.component';

describe('BannerLivePriviewComponent', () => {
  let component: BannerLivePriviewComponent;
  let fixture: ComponentFixture<BannerLivePriviewComponent>;

  beforeEach(async(() => {
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
