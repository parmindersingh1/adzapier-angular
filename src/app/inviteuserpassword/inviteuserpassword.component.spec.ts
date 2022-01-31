import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteuserpasswordComponent } from './inviteuserpassword.component';

describe('InviteuserpasswordComponent', () => {
  let component: InviteuserpasswordComponent;
  let fixture: ComponentFixture<InviteuserpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteuserpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteuserpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
