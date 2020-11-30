import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService, OrganizationService } from 'src/app/_services';
import { CompanyService } from 'src/app/company.service';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-organizationteam',
  templateUrl: './organizationteam.component.html',
  styleUrls: ['./organizationteam.component.scss']
})
export class OrganizationteamComponent implements OnInit {
  @ViewChild('confirmTemplate', { static: false }) confirmModal: TemplateRef<any>;
  modalRef: BsModalRef;
  inviteUserOrgForm: FormGroup;
  confirmationForm: FormGroup;
  organizationID: any;
  organizationTeamMemberList: any = [];
  roleList: any;
  submitted;
  emailid;
  p: number = 1;
  pageSize: any = 5;
  totalCount: any;
  searchText: any;
  paginationConfig: TablePaginationConfig;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  isUpdateUserinvitation = false;
  approverID: any;
  recordID: any;
  isconfirmationsubmitted: boolean;
  confirmProperty: any;
  confirmTeammember: any;
  selectedTeamMember: any;
  controlname: string;
  organizationName: any;
  userList: any = [];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private orgService: OrganizationService,
              private loading: NgxUiLoaderService,
              private bsmodalService: BsModalService
  ) { this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount }; }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.organizationID = params.get('id');
      console.log(this.organizationID, 'organizationID..');
      this.loadOrgTeamMembers(this.organizationID);
    });
    this.loadRoleList();
    this.inviteUserOrgForm = this.formBuilder.group({
      emailid: ['', [Validators.required]],
      permissions: ['', [Validators.required]],
    });
    this.confirmationForm = this.formBuilder.group({
      userInput: ['', [Validators.required]]
    });
    this.loadUserListForInvitation();
  }
  get f() { return this.inviteUserOrgForm.controls; }
  get confirmDelete() { return this.confirmationForm.controls; }
  backToOrganizationDetail() {
    this.router.navigate(['settings/organizations/details', this.organizationID]);
  }

  loadOrgTeamMembers(orgID) {
    const key = 'response';
    const pagelimit = '&limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    console.log('page Limit', pagelimit);
    this.orgService.getOrgTeamMembers(orgID, pagelimit).subscribe((data) => {
      this.loading.stop();
      this.organizationTeamMemberList = data.response;
      this.paginationConfig.totalItems = data.count;
    });
  }

  loadRoleList() {
    this.loading.start();
    this.userService.getRoleList(this.constructor.name, moduleName.organizationTeamModule).subscribe((data) => {
      this.loading.stop();
      if (data) {
        const key = 'response';
        // const roleid = data[key];
        this.roleList = data[key];
      }
    });
  }

  open(content) {
    this.inviteUserOrgForm.get('emailid')[this.isUpdateUserinvitation ? 'disable' : 'enable']();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '&limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    const key = 'response';
    this.loading.start();
    this.orgService.getOrgTeamMembers(this.organizationID, pagelimit).subscribe((data) => {
      this.loading.stop();
      this.organizationTeamMemberList = data.response;
      this.paginationConfig.totalItems = data.count;
    }, (error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
      this.modalService.dismissAll('Error!');
    });
  }


  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
    this.paginationConfig.currentPage = 1;
    this.loadOrgTeamMembers(this.organizationID);
  }


  onSubmitInviteUserOrganization() {
    this.submitted = true;
    if (this.inviteUserOrgForm.invalid) {
      return false;
    } else {
      if (!this.isUpdateUserinvitation) {
        const requestObj = {
          email: this.inviteUserOrgForm.value.emailid,
          role_id: this.inviteUserOrgForm.value.permissions,
          orgid: this.organizationID,
          user_level: 'organization'
        };
        this.companyService.inviteUser( this.constructor.name, moduleName.organizationTeamModule, requestObj)
          .subscribe((data) => {
            if (data) {
              this.alertMsg = data.response;
              this.isOpen = true;
              this.alertType = 'success';
              this.loadOrgTeamMembers(this.organizationID);
              this.onCancelClick();
            }
          }, (error) => {
            this.alertMsg = JSON.stringify(error);
            this.isOpen = true;
            this.alertType = 'danger';
            this.onCancelClick();
          });
      } else {
        const requestObj = {
          id: this.recordID,
          user_id: this.approverID,
          role_id: this.inviteUserOrgForm.value.permissions
        };
        this.companyService.updateUserRole( this.constructor.name, moduleName.organizationTeamModule, requestObj)
          .subscribe((data) => {
            if (data) {
              this.alertMsg = data.response;
              this.isOpen = true;
              this.alertType = 'success';
              this.loadOrgTeamMembers(this.organizationID);
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

  onResendInvitation(userid) {
    this.companyService.resendInvitation(this.constructor.name, moduleName.organizationTeamModule, userid)
      .subscribe((data) => {
        if (data) {
          this.alertMsg = 'We have sent a email on your Email Id';
          this.isOpen = true;
          this.alertType = 'info';
          this.loadOrgTeamMembers(this.organizationID);
          this.inviteUserOrgForm.reset();
          this.modalService.dismissAll('Data Saved!');
        }
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
        this.modalService.dismissAll('Error!');
      });
  }

  removeTeamMember(obj, control: string) {
    this.confirmTeammember = obj;
    this.controlname = control;
    this.selectedTeamMember = obj.user_email;
    this.openModal(this.confirmModal);
  }
 
  editUserInvitation(content, data) {
    console.log(data, 'editUserInvitation..');
    this.isUpdateUserinvitation = true;
    this.approverID = data.approver_id;
    this.recordID = data.id;
    this.inviteUserOrgForm.controls['emailid'].setValue(data.user_email);
    this.inviteUserOrgForm.get('emailid')[this.isUpdateUserinvitation ? 'disable' : 'enable']();
    this.inviteUserOrgForm.controls['permissions'].setValue(data.role_id);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.inviteUserOrgForm.reset();
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.inviteUserOrgForm.reset();
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmDeleteTeamMember() {
    this.modalRef.hide();
    this.companyService.removeTeamMember(this.constructor.name, moduleName.organizationTeamModule, this.confirmTeammember,
      this.organizationID).subscribe((data) => {
        if (data) {
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'success';
          this.loadOrgTeamMembers(this.organizationID);
        }
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
  
  onCancelClick() {
    this.submitted = false;
    this.isUpdateUserinvitation = false;
    this.inviteUserOrgForm.reset();
    this.modalService.dismissAll('Canceled');
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
    } else if (this.controlname === 'organization') {
      return this.organizationName;
    } else if (this.controlname === 'property') {
      return this.confirmProperty;
    }
  }

  loadUserListForInvitation() {
    this.companyService.getUserList(this.constructor.name, moduleName.companyModule).subscribe((data) => {
      this.userList = data.response;
    });
  }


}
