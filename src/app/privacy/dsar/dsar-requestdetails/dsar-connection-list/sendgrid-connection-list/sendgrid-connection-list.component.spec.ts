import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendgridConnectionListComponent } from './sendgrid-connection-list.component';

describe('SendgridConnectionListComponent', () => {
  let component: SendgridConnectionListComponent;
  let fixture: ComponentFixture<SendgridConnectionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendgridConnectionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendgridConnectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
