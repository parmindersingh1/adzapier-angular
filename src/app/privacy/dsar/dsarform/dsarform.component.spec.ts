import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DsarformComponent } from './dsarform.component';

describe('DsarformComponent', () => {
  let component: DsarformComponent;
  let fixture: ComponentFixture<DsarformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DsarformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsarformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
