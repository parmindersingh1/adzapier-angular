import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { OrganizationService, UserService } from '../_services';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationService } from 'src/app/_services/organization.service';
import { CompanyService } from 'src/app/company.service';
import { UserService } from 'src/app/_services/user.service';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// import { CompanyService } from '../company.service';
@Component({
  selector: 'app-organizationdetails',
  templateUrl: './organizationdetails.component.html',
  styleUrls: ['./organizationdetails.component.scss']
})
export class OrganizationdetailsComponent implements OnInit {
  @ViewChild('propertyModal', { static: true }) propertyModal: TemplateRef<any>;
  @ViewChild('confirmTemplate', { static: false }) confirmModal: TemplateRef<any>;
  @ViewChild('deletePropertyAlert',{static: false}) deleteAlertModal: TemplateRef<any>;
  modalRef: BsModalRef;
  organisationPropertyForm: FormGroup;
  editOrganisationForm: FormGroup;
  inviteUserOrgForm: FormGroup;
  confirmationForm: FormGroup;
  organizationID: any;
  organizationDetails: any;
  organizationName: any;
  addressOne: any;
  addressTwo: any;
  city: string;
  state: string;
  zipcode: number;
  taxID: any;
  approverID: any;
  p: number = 1;
  pageSize: any = 5;
  totalCount: any;
  paginationConfig: TablePaginationConfig;

  p2: number = 1;
  propertyPgSize: any = 5;
  propertyTotalCount: any;
  propertyPageConfig: TablePaginationConfig;
  // = { itemsPerPage: this.propertyPgSize, currentPage: this.p2, totalItems: this.propertyTotalCount, id: 'propertyPagination' };

  propertyList: any;
  submitted;
  isEditProperty: boolean;
  propertyname: any;
  website: any;
  logourl: any;
  myContext;
  isInviteFormSubmitted: any;
  organizationTeamMemberList: any;
  roleList: any;
  emailid: any;
  selectedProperty: any = [];
  managedOrganization: any;
  searchText: any;
  searchPropertyText: any;
  currentManagedOrgID: any;
  currrentManagedPropID: any;
  isControlDisabled: boolean;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  email: any;
  phone: any;
  isUpdateUserinvitation = false;
  recordID: any;
  controlname: string;
  selectedOrgID: any;
  selectedPropID: any;
  userInput: any;
  isconfirmationsubmitted: boolean;
  confirmProperty: any;
  confirmTeammember: any;
  selectedTeamMember: any;
  userList: any = [];
  noResult = false;
  constructor(private activatedRoute: ActivatedRoute,
              private orgService: OrganizationService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private userService: UserService,
              private router: Router,
              private bsmodalService: BsModalService,
              private cdref: ChangeDetectorRef) {
    this.orgService.currentProperty.subscribe((data) => {
      this.currentManagedOrgID = data.organization_id;
      this.currrentManagedPropID = data.property_id;
    });
    this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount, id: 'userPagination' };
    this.propertyPageConfig = {
      itemsPerPage: this.propertyPgSize, currentPage: this.p2,
      totalItems: this.propertyTotalCount, id: 'propertyPagination'
    };
  }

  ngOnInit() {
    this.orgService.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgService.getCurrentOrgWithProperty();
        if (orgDetails !== undefined) {
          this.currentManagedOrgID = orgDetails.organization_id;
          this.currrentManagedPropID = orgDetails.property_id;
        }
      }
    });
    this.loadRoleList();

    this.activatedRoute.paramMap.subscribe(params => {
      this.organizationID = params.get('id');
      this.loadOrganizationByID(this.organizationID);
      this.getPropertyList(this.organizationID);
      this.loadOrgTeamMembers(this.organizationID);

    });


    this.isEditProperty = false;
    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const zipRegex = '^[0-9]{5,20}$'; //'^[0-9]{6}(?:-[0-9]{4})?$';
    const strRegx = '.*\\S.*[a-zA-Z \-\']';
    // const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    const alphaNumeric = '.*\\S.*[a-zA-z0-9 ]';
    const phoneNumRegx = '^[0-9]*$'; // '^-?(0|[1-9]\d*)?$';
    this.organisationPropertyForm = this.formBuilder.group({
      propertyname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      website: ['', [Validators.required, Validators.pattern(urlRegex)]],
      logourl: ['']
    });
    this.inviteUserOrgForm = this.formBuilder.group({
      emailid: ['', [Validators.required, Validators.pattern]],
      permissions: ['', [Validators.required]]
    });
    this.editOrganisationForm = this.formBuilder.group({
      organizationName: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      taxID: [''],
      addressOne: ['', [Validators.required]],
      addressTwo: [''],
      city: ['', [Validators.required, Validators.pattern(strRegx)]],
      state: ['', [Validators.required, Validators.pattern(strRegx)]],
      zipcode: ['', [Validators.required, Validators.pattern(zipRegex)]],
      email: ['', [Validators.required, Validators.pattern]],
      phone: ['', [Validators.required, Validators.pattern(phoneNumRegx)]]
    });
    this.confirmationForm = this.formBuilder.group({
      userInput: ['', [Validators.required]]
    });
   // this.loadUserListForInvitation();
  }
  get f() { return this.inviteUserOrgForm.controls; }
  get orgProp() { return this.organisationPropertyForm.controls; }
  get editOrg() { return this.editOrganisationForm.controls; }
  get confirmDelete() { return this.confirmationForm.controls; }
  loadOrganizationByID(id) {
    this.orgService.getOrganizationByID(id).subscribe((data) => {
      this.organizationName = data.response.orgname;
      this.addressOne = data.response.address1;
      this.addressTwo = data.response.address2;
      this.city = data.response.city;
      this.state = data.response.state;
      this.taxID = data.response.tax_id;
      this.zipcode = data.response.zipcode;
      this.email = data.response.email;
      this.phone = data.response.phone;
    });
    // this.pathValues();
  }

  getPropertyList(id): any {
    // this.isOpen = !this.isOpen;
    this.orgService.getPropertyList(id).subscribe((data) => {
      this.orgService.emitUpdatedOrgList.emit(data.response);
      if (data.response.length === 0) {
        this.alertMsg = 'Adding property is mandatory. Add Property first.';
        this.isOpen = true;
        this.alertType = 'info';
        this.modalService.open(this.propertyModal);
      }
      // console.log(this.propertyList,'this.propertyList..');
      return this.propertyList = data.response;
    });
  }

  open(content) {
    this.propertyname = '';
    this.website = '';
    this.logourl = '';
    this.inviteUserOrgForm.get('emailid')[this.isUpdateUserinvitation ? 'disable' : 'enable']();
    this.isEditProperty = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editModalPopup(content, data) {
    this.isEditProperty = true;
    // this.selectedOrg = data;
    this.propertyname = data.name;
    this.website = data.website;
    this.logourl = data.logo_url;
    this.myContext = { oid: data.oid, pid: data.id };
    this.organisationPropertyForm.controls['propertyname'].setValue(data.name);
    this.organisationPropertyForm.controls['website'].setValue(data.website);
    this.organisationPropertyForm.controls['logourl'].setValue(data.logo_url);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.organisationPropertyForm.reset();
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.organisationPropertyForm.reset();
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editOrganizationModalPopup(content) {
    this.editOrganisationForm.controls['organizationName'].setValue(this.organizationName);
    this.editOrganisationForm.controls['addressOne'].setValue(this.addressOne);
    this.editOrganisationForm.controls['addressTwo'].setValue(this.addressTwo);
    this.editOrganisationForm.controls['city'].setValue(this.city);
    this.editOrganisationForm.controls['state'].setValue(this.state);
    this.editOrganisationForm.controls['taxID'].setValue(this.taxID);
    this.editOrganisationForm.controls['zipcode'].setValue(this.zipcode);
    this.editOrganisationForm.controls['email'].setValue(this.email);
    this.editOrganisationForm.controls['phone'].setValue(this.phone);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  updateOrganisationData() {
    this.submitted = true;
    if (this.editOrganisationForm.invalid) {
      return false;
    } else {
      //  if (!this.isEditOrganization) {
      const updateObj = {
        orgname: this.editOrganisationForm.value.organizationName,
        taxID: this.editOrganisationForm.value.taxID,
        address1: this.editOrganisationForm.value.addressOne,
        address2: this.editOrganisationForm.value.addressTwo,
        city: this.editOrganisationForm.value.city,
        state: this.editOrganisationForm.value.state,
        zipcode: this.editOrganisationForm.value.zipcode,
        email: this.editOrganisationForm.value.email,
        phone: this.editOrganisationForm.value.phone
      };
      this.orgService.updateOrganization(this.organizationID, updateObj).subscribe((res) => {
        if (res) {
          this.alertMsg = 'Organization has been updated!';
          this.isOpen = true;
          this.alertType = 'success';
          console.log(this.currentManagedOrgID, 'currentManagedOrgID..');
          this.loadOrganizationByID(this.organizationID);
          if (res.response.id === this.currentManagedOrgID) {
            this.orgService.updateEditedOrganization(res);
          }
          this.orgService.isOrganizationUpdated.next(true);
          this.modalService.dismissAll('Data Saved!');
        }
      }, (error) => {
        this.alertMsg = error;
        this.isOpen = true;
        this.alertType = 'danger';
      });
    }
  }

  disableProperty(obj, control: string) {
    this.controlname = control;
    this.selectedPropID = obj.id;
    this.selectedOrgID = obj.oid;
    this.confirmProperty = obj.name;
    if(this.selectedPropID === this.currrentManagedPropID){
      this.openModal(this.deleteAlertModal);
      return false;
    }
    this.openModal(this.confirmModal);
  }

  confirmPropertyDelete() {
    this.modalRef.hide();
    this.orgService.disableProperty(this.selectedOrgID, this.selectedPropID).subscribe((data) => {
      if (data) {
        this.userInput = '';
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.getPropertyList(this.organizationID);
        this.orgService.isOrganizationUpdated.next(true);
        this.onCancelClick();
      }
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  pathValues() {
    this.orgService.getOrganizationByID(this.organizationID).subscribe((data) => {
      this.organizationName = data.response.orgname;
      this.addressOne = data.response.address1;
      this.addressTwo = data.response.address2;
      this.city = data.response.city;
      this.state = data.response.state;
      this.taxID = data.response.tax_id;
      this.zipcode = data.response.zipcode;
    });

  }

  onSubmit() {
    this.submitted = true;

    if (this.organisationPropertyForm.invalid) {
      return false;
    } else {
      if (!this.isEditProperty) {
        const reqObj = {
          name: this.organisationPropertyForm.value.propertyname,
          website: this.organisationPropertyForm.value.website,
          logo_url: this.organisationPropertyForm.value.logourl
        };
        this.orgService.addProperties(this.organizationID, reqObj).subscribe((result) => {
          if (result) {
            this.alertMsg = 'New property has been added!';
            this.isOpen = true;
            this.alertType = 'success';
            this.getPropertyList(this.organizationID);
            this.orgService.isOrganizationUpdated.next(true);
            this.organisationPropertyForm.reset();
            this.submitted = false;
          }
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
        this.organisationPropertyForm.reset();
        this.modalService.dismissAll('Data Saved!');
      } else {
        const reqObj = {
          name: this.organisationPropertyForm.value.propertyname,
          website: this.organisationPropertyForm.value.website,
          logo_url: this.organisationPropertyForm.value.logourl
        };
        this.orgService.editProperties(this.myContext.oid, this.myContext.pid, reqObj).subscribe((res) => {
          if (res) {
            this.alertMsg = 'Property has been updated!';
            this.isOpen = true;
            this.alertType = 'success';
            this.getPropertyList(res.response.oid);

            if (res.response.id === this.currrentManagedPropID) {
              // this.orgService.changeCurrentSelectedProperty(res);
              const orgDetails = this.orgService.getCurrentOrgWithProperty();
              this.orgService.updateEditedProperty(res);
            }
          }
          // this.orgService.isOrganizationUpdated.next(true);
          this.organisationPropertyForm.reset();
          this.modalService.dismissAll();
          this.submitted = false;
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
      }
    }

  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '&limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.orgService.getOrgTeamMembers(this.organizationID, pagelimit).subscribe((data) => {
      this.organizationTeamMemberList = data.response;
      this.paginationConfig.totalItems = data.count;
      return this.organizationTeamMemberList;
    });
  }

  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
    this.paginationConfig.currentPage = 1;
    this.loadOrgTeamMembers(this.organizationID);
  }

  propertyPageChangeEvent(event) {
    this.propertyPageConfig.currentPage = event;
    const pagelimit = '&limit=' + this.propertyPageConfig.itemsPerPage + '&page=' + this.propertyPageConfig.currentPage;
    // const key = 'response';
    this.orgService.getPropertyList(this.organizationID, pagelimit).subscribe((data) => {
      this.propertyPageConfig.totalItems = data.count;
      this.propertyList = data.response;
      return this.propertyList;
    });
  }

  onPagesizeChangeEvent(event) {
    this.propertyPageConfig.itemsPerPage = Number(event.target.value);
    this.propertyPageConfig.currentPage = 1;
  }

  onSubmitInviteUserOrganization() {
    this.isInviteFormSubmitted = true;
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
        this.companyService.inviteUser(this.constructor.name, moduleName.organizationDetailsModule, requestObj)
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
        this.companyService.updateUserRole(this.constructor.name, moduleName.organizationDetailsModule, requestObj)
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

  loadRoleList() {
    this.userService.getRoleList(this.constructor.name, moduleName.organizationDetailsModule).subscribe((data) => {
      if (data) {
        const key = 'response';
        // const roleid = data[key];
        this.roleList = data[key];
      }
    });
  }

  loadOrgTeamMembers(orgID) {
    const key = 'response';
    const pagelimit = '&limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.orgService.getOrgTeamMembers(orgID, pagelimit).subscribe((data) => {
      this.organizationTeamMemberList = data.response;
      this.paginationConfig.totalItems = data.count;
    });
  }

  loadUserListForInvitation(searchText) {
      this.companyService.getUserList(searchText,
        this.constructor.name, moduleName.companyModule).subscribe((data) => {
        this.userList = data.response;
      });
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  onSearchEmailId(searchEmail: string) {
    this.loadUserListForInvitation(searchEmail);
  }

  viewOrganizationTeam() {
    this.router.navigate(['settings/organizations/organizationteam', this.organizationID]);
  }

  disableOrganization(control: string) {
    this.controlname = control;
    this.openModal(this.confirmModal);
  }

  confirmDeleteTeamMember() {
    this.modalRef.hide();
    this.companyService.removeTeamMember(this.constructor.name, moduleName.organizationDetailsModule, this.confirmTeammember,
      this.organizationID).subscribe((data) => {
        if (data) {
          this.alertMsg = data.response;
          this.isOpen = true;
          this.alertType = 'success';
          this.loadOrgTeamMembers(this.organizationID);
          this.onCancelClick();
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

  isDateOrString(status): boolean {
    const date = Date.parse(status);
    if (isNaN(date)) {
      return false;
    }
    return true;
  }
  onResendInvitation(userid) {
    this.companyService.resendInvitation(this.constructor.name, moduleName.organizationDetailsModule, userid)
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

  editUserInvitation(content, data) {
    console.log(data, 'editUserInvitation..');
    this.isUpdateUserinvitation = true;
    this.recordID = data.id;
    this.approverID = data.approver_id;
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

  onCancelClick() {
    this.isInviteFormSubmitted = false;
    this.isUpdateUserinvitation = false;
    this.isconfirmationsubmitted = false;
    this.inviteUserOrgForm.reset();
    this.modalService.dismissAll('Canceled');
    this.confirmationForm.reset();
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onCancelClickProperty() {
    this.submitted = false;
    this.organisationPropertyForm.reset();
    this.modalService.dismissAll('Canceled');
  }

  loadLogoURL(logourl): string {
    if (logourl !== null) {
      if (logourl.indexOf('http') !== -1) {
        return logourl;
      } else {
        return logourl = 'assets/imgs/no_image.png';
      }
    } else {
      return logourl = 'assets/imgs/no_image.png';
    }

  }

  // confirm before delete record
  confirmOrganizationDelete() {
    // if (userinput === 'Delete' || userinput === 'DELETE') {
    this.modalRef.hide();
    const reqObj = {
      active: false
    };
    this.orgService.disableOrganization(this.organizationID, reqObj).subscribe((data) => {
      if (data) {
        this.userInput = '';
        this.alertMsg = data.error;
        this.isOpen = true;
        this.alertType = 'success';
        this.orgService.isOrganizationUpdated.next(true);
        this.router.navigate(['settings/organizations']);
      }
    }, (err) => {
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
    });
    // } else {
    //   alert('aaa');
    // }
  }

  onSubmitConfirmation(selectedaction) {
    this.isconfirmationsubmitted = true;
    if (this.confirmationForm.invalid) {
      return false;
    } else {
      const userInput = this.confirmationForm.value.userInput;
      if (userInput === 'Delete') {
        if (selectedaction === 'organization') {
          this.confirmOrganizationDelete();
          this.router.navigate(['settings/organizations']);
        } else if (selectedaction === 'property') {
          this.confirmPropertyDelete();
        } else if (selectedaction === 'team member') {
          this.confirmDeleteTeamMember();
        }
      } else {
        // this.confirmationForm.reset();
        // this.isconfirmationsubmitted = false;
        return false;
      }
    }
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
  // ngAfterContentChecked() {
  //   this.cdref.detectChanges();
  // }

}
