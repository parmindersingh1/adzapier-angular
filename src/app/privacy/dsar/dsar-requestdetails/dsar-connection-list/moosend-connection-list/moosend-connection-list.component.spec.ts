import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoosendConnectionListComponent } from './moosend-connection-list.component';

describe('MoosendConnectionListComponent', () => {
  let component: MoosendConnectionListComponent;
  let fixture: ComponentFixture<MoosendConnectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoosendConnectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoosendConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
