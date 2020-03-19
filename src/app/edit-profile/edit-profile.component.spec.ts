import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder } from '@angular/forms';
import { EditProfileComponent } from './edit-profile.component';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormBuilder, FormsModule],
      declarations: [EditProfileComponent],
      providers: [ FormBuilder ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submit form', () => {
    expect(component.profileForm.valid).toBeFalsy();
  });

  it('valid email id', () => {
    let email = component.profileForm.controls['newemail'];
    expect(email.valid).toBeFalsy();
  })

});
