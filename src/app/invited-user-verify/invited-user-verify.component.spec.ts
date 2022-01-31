import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedUserVerifyComponent } from './invited-user-verify.component';

describe('InvitedUserVerifyComponent', () => {
  let component: InvitedUserVerifyComponent;
  let fixture: ComponentFixture<InvitedUserVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitedUserVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedUserVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
