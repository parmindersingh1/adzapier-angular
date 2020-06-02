import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { UserService } from '../_services';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companyDetails: any;
  address1: any;
  address2: any;
  city: string;
  name: any;
  state: string;
  taxid: any;
  zipcode: number;
  orgname: any;
  companyId: any;
  companyForm: FormGroup;
  inviteUserForm: FormGroup;
  submitted;
  isInviteFormSubmitted;
  teamMemberList: any;
  permissions: any = [];
  userRoleID: any;
  roleList: any;
  emailid: any;
  pageSize: any = 5;
  searchText: any;
  totalCount: any;

  p: number = 1;
  i: any = [];
  paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };

  constructor(private companyService: CompanyService, private modalService: NgbModal,
    private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.loadRoleList();
    const zipRegex = '^[0-9]*$';
    const spaceRegx = '^\S*$';
    const strRegx = '^[a-zA-Z \-\']+';
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.companyForm = this.formBuilder.group({
      orgname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      tax_id: [''],
      address1: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      address2: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      city: ['', [Validators.required, Validators.pattern(strRegx)]],
      state: ['', [Validators.required, Validators.pattern(strRegx)]],
      zipcode: ['', [Validators.required, Validators.pattern(zipRegex)]],
    });
    this.inviteUserForm = this.formBuilder.group({
      emailid: ['', [Validators.required, Validators.pattern]],
      permissions: ['', [Validators.required]]
    });
    this.loadCompanyDetails();
    this.pathValues();
    this.loadCompanyTeamMembers();
  }
  get f() { return this.companyForm.controls; }
  get userInvite() { return this.inviteUserForm.controls; }
  loadCompanyDetails() {
    this.companyService.getCompanyDetails().subscribe((data) => {
      this.orgname = data.response.name;
      this.address1 = data.response.address1;
      this.address2 = data.response.address2;
      this.city = data.response.city;
      this.state = data.response.state;
      this.taxid = data.response.tax_id;
      this.zipcode = data.response.zipcode;
      this.companyId = data.response.id;
    });
  }

  editOrganizationModalPopup(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      // this.profileForm.reset();
    });
  }

  pathValues() {
    this.companyService.getCompanyDetails().subscribe((user) => {
      this.companyDetails = Object.values(user);
      console.log(this.companyDetails, 'userProfile..');
      this.companyForm.patchValue({
        orgname: this.companyDetails[0].name,
        address1: this.companyDetails[0].address1,
        address2: this.companyDetails[0].address2,
        city: this.companyDetails[0].city,
        state: this.companyDetails[0].state,
        zipcode: this.companyDetails[0].zipcode,
        tax_id: this.companyDetails[0].tax_id
      });
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.companyForm.invalid) {
      return false;
    } else {
      const editObj = {
        name: this.companyForm.value.orgname,
        tax_id: this.companyForm.value.tax_id,
        address1: this.companyForm.value.address1,
        address2: this.companyForm.value.address2,
        city: this.companyForm.value.city,
        state: this.companyForm.value.state,
        zipcode: this.companyForm.value.zipcode
      };
      this.companyService.updateCompanyDetails(editObj)
        .subscribe((data) => {
          if (data) {
            //  this.isShowbtnVisible = false;
            // this.show = true;
            alert('Details has been updated successfully!');
            this.loadCompanyDetails();
            // this.userService.getCurrentUser.emit(data);
            this.modalService.dismissAll('Data Saved!');
            // this.loadUserDetails();
          }
        }, (error) => {
          alert(error);
          this.modalService.dismissAll('Error!');
          // this.isShowbtnVisible = true;
          // this.show = false;
        }
        );
      // this.profileForm.disable();
    }
  }

  onSubmitInviteUser() {
    this.isInviteFormSubmitted = true;
    if (this.inviteUserForm.invalid) {
      return false;
    } else {
      const requestObj = {
        email: this.inviteUserForm.value.emailid,
        role_id: this.inviteUserForm.value.permissions,
        user_level: 'company'
      };
      this.companyService.inviteUser(requestObj)
        .subscribe((data) => {
          if (data) {
            alert('Details has been updated successfully!');
            this.inviteUserForm.reset();
            this.loadCompanyTeamMembers();
            this.modalService.dismissAll('Data Saved!');
          }
        }, (error) => {
          alert(error);
          this.modalService.dismissAll('Error!');
        });
    }
  }


  

  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.companyService.getCompanyTeamMembers(pagelimit).subscribe((data) => {
      const key = 'response';
      this.teamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.teamMemberList;
    });
    // this.orgservice.orglist(pagelimit).subscribe((data) => {
    //   const key = 'response';
    //   this.orgList = data[key];
    //   this.paginationConfig.totalItems = data.count;
    //   return this.orgList;
    // });
  }

  onResetProfile() {
    this.companyForm.reset();
    this.modalService.dismissAll('');
    this.loadCompanyDetails();
  }

  loadCompanyTeamMembers() {
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.companyService.getCompanyTeamMembers(pagelimit).subscribe((data) => {
      const key = 'response';
      this.teamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
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

  isDateOrString(status): boolean {
    const date = Date.parse(status);
    if (isNaN(date)) {
      return false;
    }
    return true;
  }
}
