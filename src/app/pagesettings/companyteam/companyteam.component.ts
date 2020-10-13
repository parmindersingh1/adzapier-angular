import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/_services';
import { CompanyService } from 'src/app/company.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';

@Component({
  selector: 'app-companyteam',
  templateUrl: './companyteam.component.html',
  styleUrls: ['./companyteam.component.scss']
})
export class CompanyteamComponent implements OnInit {
  teamMemberList: any;
  companyForm: FormGroup;
  inviteUserForm: FormGroup;
  pageSize: any = 5;
  searchText: any;
  totalCount: any;

  p: number = 1;
  i: any = [];
  paginationConfig: TablePaginationConfig; // =
  isControlDisabled: boolean;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;

  submitted;
  isInviteFormSubmitted;
  permissions: any = [];
  userRoleID: any;
  roleList: any;
  emailid: any;

  constructor(private companyService: CompanyService, private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private loading: NgxUiLoaderService) { 
                this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
              }

  ngOnInit() {
    this.loadRoleList();
    const numZip = '^[0-9]{5,20}$'; // '^[0-9]{5}(?:-[0-9]{4})?$';
    const numRegex = '^[0-9]*$';
    const strRegx = '^[a-zA-Z\-\']+';
    const alphaNumeric = '.*\\S.*[a-zA-z0-9 ]';
    this.companyForm = this.formBuilder.group({
      orgname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      tax_id: [''],
      address1: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      address2: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      city: ['', [Validators.required, Validators.pattern(strRegx)]],
      state: ['', [Validators.required, Validators.pattern(strRegx)]],
      zipcode: ['', [Validators.required, Validators.pattern(numZip)]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
    this.inviteUserForm = this.formBuilder.group({
      emailid: ['', [Validators.required, Validators.pattern]],
      permissions: ['', [Validators.required]]
    });
    this.loadCompanyTeamMembers();
  }

  get userInvite() { return this.inviteUserForm.controls; }

  loadCompanyTeamMembers() {
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.loading.start();
    this.companyService.getCompanyTeamMembers(pagelimit).subscribe((data) => {
      this.loading.stop();
      const key = 'response';
      this.teamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
    });
  }


  loadRoleList() {
    this.loading.start();
    this.userService.getRoleList().subscribe((data) => {
      this.loading.stop();
      if (data) {
        const key = 'response';
        // const roleid = data[key];
        this.roleList = data[key];
      }
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  removeTeamMember(id) {
    this.companyService.removeTeamMember(id).subscribe((data) => {
      if (data) {
        this.alertMsg = 'User has been removed!';
        this.isOpen = true;
        this.alertType = 'success';
        this.loadCompanyTeamMembers();
      }
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
    });
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
      this.loading.start();
      this.companyService.inviteUser(requestObj)
        .subscribe((data) => {
          this.loading.stop();
          if (data) {
            this.alertMsg = 'Details has been updated successfully!';
            this.isOpen = true;
            this.alertType = 'success';
            this.loadCompanyTeamMembers();
            this.onResetInviteUser();
          }
        }, (err) => {
          this.loading.stop();
          this.alertMsg = err;
          this.isOpen = true;
          this.alertType = 'danger';
          this.modalService.dismissAll('Error!');
        });
    }
  }

  onResendInvitation(email) {
    const requestObj = {
      email,
      user_level: 'company'
    };
    this.loading.start();
    this.companyService.inviteUser(requestObj)
      .subscribe((data) => {
        this.loading.stop();
        if (data) {
        //  this.notification.info('Invitation Send', 'We have sent a email on your Email Id', notificationConfig);
          this.alertMsg = 'We have sent a email on your Email Id';
          this.isOpen = true;
          this.alertType = 'success';

          this.inviteUserForm.reset();
          this.loadCompanyTeamMembers();
          this.modalService.dismissAll('Data Saved!');
        }
      }, (err) => {
        this.loading.stop();
        this.alertMsg = JSON.stringify(err);
        this.isOpen = true;
        this.alertType = 'danger';
     //   this.notification.error('Invitation Send', 'Something went wrong...', notificationConfig);
        this.modalService.dismissAll('Error!');
      });
  }

  onResetInviteUser() {
    this.isInviteFormSubmitted = false;
    this.inviteUserForm.reset();
    this.modalService.dismissAll('Data Saved!');
  }

  editOrganizationModalPopup(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      // this.profileForm.reset();
    });
    this.inviteUserForm.reset();
    this.isInviteFormSubmitted = false;
  }

  isDateOrString(status): boolean {
    const date = Date.parse(status);
    if (isNaN(date)) {
      return false;
    }
    return true;
  }

  onCloseAlert(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  
  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
    this.loadCompanyTeamMembers();
  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.loading.start();
    this.companyService.getCompanyTeamMembers(pagelimit).subscribe((data) => {
      this.loading.stop();
      const key = 'response';
      this.teamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
    });
  }

}
