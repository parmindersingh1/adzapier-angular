import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsarConnectionListComponent } from './dsar-connection-list.component';

describe('DsarConnectionListComponent', () => {
  let component: DsarConnectionListComponent;
  let fixture: ComponentFixture<DsarConnectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsarConnectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsarConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
