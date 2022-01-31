import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCampaignComponent } from './active-campaign.component';

describe('ActiveCampaignComponent', () => {
  let component: ActiveCampaignComponent;
  let fixture: ComponentFixture<ActiveCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveCampaignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
