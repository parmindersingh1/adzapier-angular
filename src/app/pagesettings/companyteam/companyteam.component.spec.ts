import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyteamComponent } from './companyteam.component';

describe('CompanyteamComponent', () => {
  let component: CompanyteamComponent;
  let fixture: ComponentFixture<CompanyteamComponent>;

  beforeEach(async(() => {
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
