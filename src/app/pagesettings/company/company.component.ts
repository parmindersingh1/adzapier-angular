import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { UserService } from 'src/app/_services';
import { CompanyService } from 'src/app/company.service';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  @ViewChild('confirmTemplate', { static: false }) confirmModal: TemplateRef<any>;
  modalRef: BsModalRef;
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
  phone: any;
  email: any;
  companyForm: FormGroup;
  inviteUserForm: FormGroup;
  confirmationForm: FormGroup;
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
  isUpdateUserinvitation = false;
  p: number = 1;
  i: any = [];
  paginationConfig: TablePaginationConfig;
  isControlDisabled: boolean;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  approverID: any;
  recordID: any;
  isconfirmationsubmitted: boolean;
  confirmTeammember: any;
  selectedTeamMember: any;
  controlname: string;
  userList: any = [];
  constructor(private companyService: CompanyService, private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private loading: NgxUiLoaderService,
              private bsmodalService: BsModalService
  ) {
    this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
   }

  ngOnInit() {
    this.loadRoleList();
    const numZip = '^[0-9]{5,20}$'; // '^[0-9]{5}(?:-[0-9]{4})?$';
    const numRegex =  '^[0-9]*$';
    const strRegx = '^[a-zA-Z\-\']+';
    const alphaNumeric = '.*\\S.*[a-zA-z0-9 ]';
    this.companyForm = this.formBuilder.group({
      orgname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      tax_id: [''],
      address1: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      address2: [''],
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
    this.confirmationForm = this.formBuilder.group({
      userInput: ['', [Validators.required]]
    });
    this.loadCompanyDetails();
    this.pathValues();
    this.loadCompanyTeamMembers();
    this.loadUserListForInvitation();
  }
  get f() { return this.companyForm.controls; }
  get userInvite() { return this.inviteUserForm.controls; }
  get confirmDelete() { return this.confirmationForm.controls; }
  loadCompanyDetails() {
    this.loading.start();
    this.companyService.getCompanyDetails(this.constructor.name, moduleName.companyModule).subscribe((data) => {
      console.log(data,'CC data..');
      this.loading.stop();
      this.orgname = data.response.name;
      this.address1 = data.response.address1;
      this.address2 = data.response.address2;
      this.city = data.response.city;
      this.state = data.response.state;
      this.taxid = data.response.tax_id;
      this.zipcode = data.response.zipcode;
      this.companyId = data.response.id;
      this.email = data.response.email;
      this.phone = data.response.phone;
    }, (err) => {
      this.loading.stop();
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
      this.modalService.dismissAll('Error!');
  });
  }

  editOrganizationModalPopup(content) {
    this.isInviteFormSubmitted = false;
    this.isUpdateUserinvitation = false;
    this.inviteUserForm.reset();
    this.inviteUserForm.get('emailid')[this.isUpdateUserinvitation ? 'disable' : 'enable']();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      // this.profileForm.reset();
    });
  }

  pathValues() {
    this.loading.start();
    this.companyService.getCompanyDetails(this.constructor.name, moduleName.companyModule).subscribe((user) => {
      this.companyDetails = Object.values(user);
      this.loading.stop();
      console.log(this.companyDetails, 'userProfile..');
      this.companyForm.patchValue({
        orgname: this.companyDetails[0].name,
        address1: this.companyDetails[0].address1,
        address2: this.companyDetails[0].address2,
        city: this.companyDetails[0].city,
        state: this.companyDetails[0].state,
        zipcode: this.companyDetails[0].zipcode,
        tax_id: this.companyDetails[0].tax_id,
        email: this.companyDetails[0].email,
        phone: this.companyDetails[0].phone
      });
    }, (err) => {
      this.loading.stop();
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
      this.modalService.dismissAll('Error!');
  });
  }

  onSubmit() {
    this.submitted = true;
    if (this.companyForm.invalid) {
      return false;
    } else {
      const editObj = {
        name: this.companyForm.value.orgname.trim(),
        tax_id: this.companyForm.value.tax_id.trim(),
        address1: this.companyForm.value.address1.trim(),
        address2: this.companyForm.value.address2.trim(),
        city: this.companyForm.value.city.trim(),
        state: this.companyForm.value.state.trim(),
        zipcode: this.companyForm.value.zipcode.trim(),
        email: this.companyForm.value.email.trim(),
        phone: this.companyForm.value.phone.trim()
      };
      this.loading.start();
      this.companyService.updateCompanyDetails(this.constructor.name, moduleName.companyModule, editObj)
        .subscribe((data) => {
          this.loading.stop();
          if (data) {
            this.alertMsg = 'Details has been updated successfully!';
            this.isOpen = true;
            this.alertType = 'success';
            this.loadCompanyDetails();
            this.modalService.dismissAll('Data Saved!');
          }
        }, (err) => {
            this.loading.stop();
            this.alertMsg = err;
            this.isOpen = true;
            this.alertType = 'danger';
            this.modalService.dismissAll('Error!');
        }
        );
    }
  }

  onSubmitInviteUser() {
    this.isInviteFormSubmitted = true;
    if (this.inviteUserForm.invalid) {
      return false;
    } else {
      if (!this.isUpdateUserinvitation) {
        const requestObj = {
          email: this.inviteUserForm.value.emailid,
          role_id: this.inviteUserForm.value.permissions,
          user_level: 'company'
        };
        this.companyService.inviteUser( this.constructor.name, moduleName.organizationDetailsModule, requestObj)
          .subscribe((data) => {
            if (data) {
              this.alertMsg = data.response;
              this.isOpen = true;
              this.alertType = 'success';
              this.loadCompanyTeamMembers();
              this.onCancelClick();
              this.isUpdateUserinvitation = false;
            }
          }, (error) => {
            this.alertMsg = error;
            this.isOpen = true;
            this.alertType = 'danger';
            this.onCancelClick();
            this.isUpdateUserinvitation = false;
          });
      } else {
        const requestObj = {
          id: this.recordID,
          user_id: this.approverID,
          role_id: this.inviteUserForm.value.permissions,
        };
        this.companyService.updateUserRole( this.constructor.name, moduleName.organizationDetailsModule, requestObj)
          .subscribe((data) => {
            if (data) {
              this.alertMsg = data.response;
              this.isOpen = true;
              this.alertType = 'success';
              this.loadCompanyTeamMembers();
              this.onCancelClick();
              this.isUpdateUserinvitation = false;
            }
          }, (error) => {
            this.alertMsg = JSON.stringify(error);
            this.isOpen = true;
            this.alertType = 'danger';
            this.onCancelClick();
            this.isUpdateUserinvitation = false;
          });
      }
    }
  }

  onCancelClick() {
    this.isInviteFormSubmitted = false;
    this.isUpdateUserinvitation = false;
    this.isconfirmationsubmitted = false;
    this.inviteUserForm.reset();
    this.modalService.dismissAll('Canceled');
    this.confirmationForm.reset();
  }

  onResetInviteUser() {
    this.isInviteFormSubmitted = false;
    this.inviteUserForm.reset();
    this.modalService.dismissAll('Data Saved!');
  }


  editUserInvitation(content, data) {
    console.log(data, 'editUserInvitation..');
    this.isUpdateUserinvitation = true;
    this.approverID = data.approver_id;
    this.recordID = data.id;
    this.inviteUserForm.controls['emailid'].setValue(data.user_email);
    this.inviteUserForm.get('emailid')[this.isUpdateUserinvitation ? 'disable' : 'enable']();
    this.inviteUserForm.controls['permissions'].setValue(data.role_id);
     
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.inviteUserForm.reset();
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.inviteUserForm.reset();
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
    this.paginationConfig.currentPage = 1;
    this.loadCompanyTeamMembers();
  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.loading.start();
    this.companyService.getCompanyTeamMembers(this.constructor.name, moduleName.companyModule, pagelimit).subscribe((data) => {
      this.loading.stop();
      const key = 'response';
      this.teamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.teamMemberList;
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
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
    this.loading.start();
    this.companyService.getCompanyTeamMembers(this.constructor.name, moduleName.companyModule, pagelimit).subscribe((data) => {
      this.loading.stop();
      const key = 'response';
      this.teamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
    });
  }

  loadRoleList() {
    this.loading.start();
    this.userService.getRoleList(this.constructor.name, moduleName.companyModule).subscribe((data) => {
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

  loadUserListForInvitation() {
    this.companyService.getUserList(this.constructor.name, moduleName.companyModule).subscribe((data) => {
      this.userList = data.response;
    });
  }

  removeTeamMember(obj, control: string) {
    this.confirmTeammember = obj;
    this.controlname = control;
    this.selectedTeamMember = obj.user_email;
    this.openModal(this.confirmModal);
  }

  isDateOrString(status): boolean {
    const date = Date.parse(status);
    if (isNaN(date)) {
      return false;
    }
    return true;
  }

  onResendInvitation(id) {
    this.companyService.resendInvitation(this.constructor.name, moduleName.companyModule, id)
    .subscribe((data) => {
      this.loading.stop();
      if (data) {
        this.alertMsg = 'We have sent a email on your Email Id';
        this.isOpen = true;
        this.alertType = 'success';

        this.loadCompanyTeamMembers();
        this.onCancelClick();
      }
    }, (err) => {
      this.loading.stop();
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
      this.onCancelClick();
    });
  }

 

  confirmDeleteTeamMember() {
    this.modalRef.hide();
    this.companyService.removeTeamMember(this.constructor.name, moduleName.companyModule, this.confirmTeammember).subscribe((data) => {
      if (data) {
        this.alertMsg = 'User has been removed!';
        this.isOpen = true;
        this.alertType = 'success';
        this.loadCompanyTeamMembers();
        this.onCancelClick();
      }
    }, (err) => {
        this.alertMsg = err;
        this.isOpen = true;
        this.alertType = 'danger';
        this.onCancelClick();
    });
  }

  onSubmitConfirmation(selectedaction) {
    this.isconfirmationsubmitted = true;
    if (this.confirmationForm.invalid) {
      return false;
    } else {
      const userInput = this.confirmationForm.value.userInput;
      if (userInput === 'Delete') {
         if (selectedaction === 'team member') {
          this.confirmDeleteTeamMember();
        }
      } else {
        return false;
      }
    }
  }


  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  cancelModal() {
    this.modalRef.hide();
    this.confirmationForm.reset();
    this.isconfirmationsubmitted = false;
    return false;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: '' });
  }

  showControlContent(): string {
    if (this.controlname === 'team member') {
      return this.selectedTeamMember;
    }
  }
}
