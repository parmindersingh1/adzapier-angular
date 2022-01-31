import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestapiConnectionListComponent } from './restapi-connection-list.component';

describe('RestapiConnectionListComponent', () => {
  let component: RestapiConnectionListComponent;
  let fixture: ComponentFixture<RestapiConnectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestapiConnectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestapiConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
