import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/_services';
import { CompanyService } from 'src/app/company.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {DataService} from '../../_services/data.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-companyteam',
  templateUrl: './companyteam.component.html',
  styleUrls: ['./companyteam.component.scss']
})
export class CompanyteamComponent implements OnInit {
  @ViewChild('confirmTemplate') confirmModal: TemplateRef<any>;
  modalRef: BsModalRef;
  teamMemberList: any;
  companyForm: FormGroup;
  inviteUserForm: FormGroup;
  confirmationForm: FormGroup;
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
  isUpdateUserinvitation = false;
  submitted;
  isInviteFormSubmitted;
  permissions: any = [];
  userRoleID: any;
  roleList: any;
  emailid: any;
  approverID: any;
  recordID: any;
  isconfirmationsubmitted: boolean;
  confirmTeammember: any;
  selectedTeamMember: any;
  controlname: string;
  companyPlanDetails: any;
  userList: any = [];
  selectusertype = true;
  constructor(private companyService: CompanyService, private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private loading: NgxUiLoaderService,
              private bsmodalService: BsModalService,
              private dataService: DataService,
              private titleService: Title 

              ) {
                this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
                this.titleService.setTitle("Company Team - Adzapier Portal");

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
      firstname: ['', [this.selectusertype ? Validators.required : '']],
      lastname: ['', [this.selectusertype ? Validators.required : '']],
      emailid: ['', [Validators.required, Validators.pattern]],
      permissions: ['', [Validators.required]]
    });
    this.inviteUserForm.get("emailid").valueChanges
    .subscribe(data=> {
      this.changeValidators();
    })
    this.confirmationForm = this.formBuilder.group({
      userInput: ['', [Validators.required]]
    });
    this.loadCompanyTeamMembers();
    this.loadUserListForInvitation();
    this.onGetCompanyPlan();
  }
  onGetCompanyPlan() {
    this.loading.start('2');
    this.dataService.getCompanyPlanDetails(this.constructor.name, moduleName.cookieConsentModule)
      .subscribe((res: any) => {
        this.companyPlanDetails = res.response;
        this.loading.stop('2')
      }, error => {
        this.loading.stop('2')
      });
  }
  get confirmDelete() { return this.confirmationForm.controls; }
  get userInvite() { return this.inviteUserForm.controls; }

  loadCompanyTeamMembers() {
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.loading.start();
    this.companyService.getCompanyTeamMembers(this.constructor.name, moduleName.companyTeamModule, pagelimit).subscribe((data) => {
      this.loading.stop();
      const key = 'response';
      this.teamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
    });
  }


  loadRoleList() {
    this.loading.start();
    this.userService.getRoleList(this.constructor.name, moduleName.companyTeamModule).subscribe((data) => {
      this.loading.stop();
      if (data) {
        const key = 'response';
        const companyLevelRoles = data[key].filter((t) => t.role_name.indexOf('Org') == -1);
        // const roleid = data[key];
        this.roleList = companyLevelRoles;
      }
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  removeTeamMember(obj, control: string) {
    this.confirmTeammember = obj;
    this.controlname = control;
    this.selectedTeamMember = obj.user_email;
    this.openModal(this.confirmModal);
  }


  confirmDeleteTeamMember() {
    this.modalRef.hide();
    this.companyService.removeTeamMember(this.constructor.name, moduleName.companyTeamModule, this.confirmTeammember).subscribe((data) => {
      if (data) {
        this.alertMsg = 'User has been removed!';
        this.isOpen = true;
        this.alertType = 'success';
        this.loadCompanyTeamMembers();
      }
      this.onGetCompanyPlan();
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
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
        // this.confirmationForm.reset();
        // this.isconfirmationsubmitted = false;
        return false;
      }
    }
  }

  onCheckSubscription(){
    const status = this.dataService.checkUserForCompany(this.companyPlanDetails, this.paginationConfig.totalItems);
    if ( status === false) {
      return false;
    }
    return true;
  }


  onSubmitInviteUser() {
    this.isInviteFormSubmitted = true;
    if (this.inviteUserForm.invalid) {
      return false;
    } else {
      if (!this.isUpdateUserinvitation) {
        if (!this.onCheckSubscription()) {
          return false;
        }
        const requestObj = {
          firstname: this.inviteUserForm.value.firstname,
          lastname: this.inviteUserForm.value.lastname,
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
              this.modalService.dismissAll('Data Saved!');
            }
            this.onGetCompanyPlan();
          }, (error) => {
            this.alertMsg = JSON.stringify(error);
            this.isOpen = true;
            this.alertType = 'danger';
            this.modalService.dismissAll('Data Saved!');
          });
      } else {
        let useremail = this.inviteUserForm.getRawValue().emailid;
        const requestObj = {
          id: this.recordID,
          email: useremail,
          user_id: this.approverID,
          role_id: this.inviteUserForm.value.permissions,
          firstname: this.inviteUserForm.value.firstname,
          lastname: this.inviteUserForm.value.lastname,
          user_level: 'company',
          action:'edit'
        };
        this.companyService.updateUserRole( this.constructor.name, moduleName.companyModule, requestObj)
          .subscribe((data) => {
            if (data) {
              this.alertMsg = data.response;
              this.isOpen = true;
              this.alertType = 'success';
              this.loadCompanyTeamMembers();
              this.onCancelClick();
            }
          }, (error) => {
            this.alertMsg = JSON.stringify(error);
            this.isOpen = true;
            this.alertType = 'danger';
            this.onCancelClick();
          });
      }
    }
  }

  onCancelClick() {
    this.modalService.dismissAll('Canceled');
    this.isInviteFormSubmitted = false;
  }


  onResendInvitation(id) {
    this.companyService.resendInvitation(this.constructor.name, moduleName.companyModule, id)
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
      this.alertMsg = err;
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

  editOrganizationModalPopup(content, type) {
    if (type === 'add') {
      if (!this.onCheckSubscription()) {
        return false;
      }
    }
    this.isInviteFormSubmitted = false;
    this.isUpdateUserinvitation = false;
    this.inviteUserForm.reset();
    this.inviteUserForm.get('emailid')[this.isUpdateUserinvitation ? 'disable' : 'enable']();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      // this.profileForm.reset();
    });
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

  editUserInvitation(content, data) {
    this.isUpdateUserinvitation = true;
    this.approverID = data.approver_id;
    this.recordID = data.id;
    this.inviteUserForm.controls['firstname'].setValue(this.separateUsername(data.user_name)[0]);
    this.inviteUserForm.controls['lastname'].setValue(this.separateUsername(data.user_name)[1]);
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
    this.companyService.getCompanyTeamMembers(this.constructor.name, moduleName.companyTeamModule, pagelimit).subscribe((data) => {
      this.loading.stop();
      const key = 'response';
      this.teamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
    });
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

  loadUserListForInvitation() {
    this.companyService.getUserList('', this.constructor.name, moduleName.companyModule).subscribe((data) => {
      this.userList = data.response;
    });
  }

  separateUsername(username){
    let res = username.split(" ");
    return res;
  }

  changeValidators() {
    if (this.selectusertype) {
      this.inviteUserForm.controls["firstname"].setValidators([Validators.required]);
      this.inviteUserForm.controls["lastname"].setValidators([Validators.required]);
    } else {
      this.inviteUserForm.controls["firstname"].clearValidators();
      this.inviteUserForm.controls["lastname"].clearValidators();
    }
    this.inviteUserForm.get("firstname").updateValueAndValidity();
    this.inviteUserForm.get("lastname").updateValueAndValidity();
  }

}
