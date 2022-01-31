import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EditProfileComponent } from './edit-profile.component';

fdescribe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      declarations: [EditProfileComponent],
      providers: [ReactiveFormsModule, FormsModule]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create edit profile component', () => {
    const fixturex = TestBed.createComponent(EditProfileComponent);
    const app = fixturex.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  fit('submit form', () => {
    expect(component.profileForm.valid).toBeFalsy();
  });

  it('edit form should be initally disable', () => {
    expect(component.profileForm.disable()).toBeFalsy();
  });

  it('valid email id', () => {
    const email = component.profileForm.controls['newemail'];
    expect(email.valid).toBeFalsy();
  });

  it('edit button status', waitForAsync(() => {
    spyOn(component, 'editUserDetails');

    let button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.editUserDetails).toHaveBeenCalled();
      expect(component.profileForm.enable).toBeTruthy();
    });
  }));


  it('initially firstname lastname should not empty', () => {
    const fname = component.profileForm.controls['firstName'];
    const lname = component.profileForm.controls['lastName'];
    expect(fname).toBeTruthy();
    expect(lname).toBeTruthy();
    component.editUserDetails();
   // component.onSubmit();
  });

});
