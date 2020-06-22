import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsarRequestdetailsComponent } from './dsar-requestdetails.component';

describe('DsarRequestdetailsComponent', () => {
  let component: DsarRequestdetailsComponent;
  let fixture: ComponentFixture<DsarRequestdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsarRequestdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsarRequestdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});