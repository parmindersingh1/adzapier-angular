import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../company.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../_services';
import { FormArray, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-organizationteam',
  templateUrl: './organizationteam.component.html',
  styleUrls: ['./organizationteam.component.scss']
})
export class OrganizationteamComponent implements OnInit {
  inviteUserOrgForm: FormGroup;
  organizationID: any;
  organizationTeamMemberList: any;
  roleList: any;
  isInviteFormSubmitted;
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private companyService: CompanyService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.organizationID = params.get('id');
      console.log(this.organizationID,'organizationID..');
    });
    this.loadRoleList();
    this.loadCompanyTeamMembers();
    this.inviteUserOrgForm = this.formBuilder.group({
      emailid: ['', [Validators.required]],
      permissions: new FormArray([])
    });
  }
  get f() { return this.inviteUserOrgForm.controls; }
  backToOrganizationDetail() {
    this.router.navigate(['/organizationdetails', this.organizationID]);
  }

  loadCompanyTeamMembers() {
    const key = 'response';
    this.companyService.getCompanyTeamMembers().subscribe((data) => {
      this.organizationTeamMemberList = data[key];
    });
  }

  loadRoleList() {
    this.userService.getRoleList().subscribe((data) => {
      if (data) {
        const key = 'response';
        // const roleid = data[key];
        this.roleList = data[key];
      }
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onCheckChange(event) {
    const formArray: FormArray = this.inviteUserOrgForm.get('permissions') as FormArray;
    const index = formArray.value.indexOf(event.target.value);
    if (index === -1) {
      formArray.push(new FormControl(event.target.value));
    } else {
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.target.value) {
          formArray.removeAt(index);
          return;
        }
      });
    }
    console.log(formArray.value, 'fcv..');
  }

  onSubmitInviteUserOrganization() {
    this.isInviteFormSubmitted = true;
    if (this.inviteUserOrgForm.invalid) {
      return false;
    } else {
      const requestObj = {
        email: this.inviteUserOrgForm.value.emailid,
        role_id: this.inviteUserOrgForm.value.permissions[0],
        orgid: this.organizationID,
        user_level: 'organization'
      };
      this.companyService.inviteUser(requestObj)
        .subscribe((data) => {
          if (data) {
            alert('Details has been updated successfully!');
            this.loadCompanyTeamMembers();
            this.modalService.dismissAll('Data Saved!');
          }
        }, (error) => {
          alert(error);
          this.modalService.dismissAll('Error!');
        });
    }
  }

}
