import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoosendComponent } from './moosend.component';

describe('MoosendComponent', () => {
  let component: MoosendComponent;
  let fixture: ComponentFixture<MoosendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoosendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoosendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
