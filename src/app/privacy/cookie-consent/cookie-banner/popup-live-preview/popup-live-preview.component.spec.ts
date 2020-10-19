import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLivePreviewComponent } from './popup-live-preview.component';

describe('PopupLivePreviewComponent', () => {
  let component: PopupLivePreviewComponent;
  let fixture: ComponentFixture<PopupLivePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupLivePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupLivePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
