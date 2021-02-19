import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyteamComponent } from './companyteam.component';

describe('CompanyteamComponent', () => {
  let component: CompanyteamComponent;
  let fixture: ComponentFixture<CompanyteamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
