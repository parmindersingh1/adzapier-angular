import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
// import { OrganizationService, UserService } from '../_services';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationService } from 'src/app/_services/organization.service';
import { CompanyService } from 'src/app/company.service';
import { UserService } from 'src/app/_services/user.service';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/_services/data.service';
import { featuresName } from 'src/app/_constant/features-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import { Location } from '@angular/common';
import { findPropertyIDFromUrl } from 'src/app/_helpers/common-utility';

import { QuickmenuService } from 'src/app/_services/quickmenu.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { CompanyService } from '../company.service';
@Component({
  selector: 'app-organizationdetails',
  templateUrl: './organizationdetails.component.html',
  styleUrls: ['./organizationdetails.component.scss']
})
export class OrganizationdetailsComponent implements OnInit {
  private unsubscribeAfterUserAction$: Subject<any> = new Subject<any>();
  @ViewChild('propertyModal', { static: true }) propertyModal: TemplateRef<any>;
  @ViewChild('confirmTemplate') confirmModal: TemplateRef<any>;
  @ViewChild('deletePropertyAlert') deleteAlertModal: TemplateRef<any>;
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
  userID;
  p2: number = 1;
  propertyPgSize: any = 5;
  propertyTotalCount: any;
  propertyPageConfig: TablePaginationConfig;
  // = { itemsPerPage: this.propertyPgSize, currentPage: this.p2, totalItems: this.propertyTotalCount, id: 'propertyPagination' };
  protocolList = ['http://','https://'];
  propertyList: any;
  submitted;
  isEditProperty: boolean;
  propertyname: any;
  website: any;
  logourl: any;
  protocol: string;
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
  private orgPlanDetails: any;
  orgLicensedPlanName;
  selectusertype = true;
  queryOID;
  queryPID;
  quickDivID;
  isRevistedLink:boolean;
  currentLinkID:any;
  iswindowclicked:boolean;
  currentRouteURL;
  changedRouteURL;
  constructor(private activatedRoute: ActivatedRoute,
              private orgService: OrganizationService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private userService: UserService,
              private router: Router,
              private dataService: DataService,
              private bsmodalService: BsModalService,
              private loading: NgxUiLoaderService,
              private location: Location,
              private quickmenuService: QuickmenuService,
              private cdref: ChangeDetectorRef) {
    // this.orgService.currentProperty.subscribe((data) => {
    //   this.currentManagedOrgID = data.organization_id || data.response.oid;
    //   this.currrentManagedPropID = data.property_id || data.response.id;
    // });
    this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount, id: 'userPagination' };
    this.propertyPageConfig = {
      itemsPerPage: this.propertyPgSize, currentPage: this.p2,
      totalItems: this.propertyTotalCount, id: 'propertyPagination'
    };
   

  }

  ngOnInit() {
    //this.currentRouteURL = this.location.path();
    this.showQuickstartTooltip();
    this.userService.isRevisitedQSMenuLink.subscribe((status) => { this.isRevistedLink = status.reclickqslink; this.currentLinkID = status.quickstartid; });
    this.orgService.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id || response.response.oid;
        this.currrentManagedPropID = response.property_id || response.response.id;
      } else {
        const orgDetails = this.orgService.getCurrentOrgWithProperty();
        if (orgDetails !== undefined) {
          this.currentManagedOrgID = orgDetails.organization_id;
          this.currrentManagedPropID = orgDetails.property_id
        }
      }
    });
    this.loadRoleList();

    this.activatedRoute.paramMap.subscribe(params => {
        this.organizationID = params.get('id');
        let oIDPIDFromURL = findPropertyIDFromUrl(this.location.path())
        if(this.organizationID !== undefined && this.organizationID.indexOf('oid') !== -1){
          this.loadOrganizationByID(oIDPIDFromURL[0]);
          this.getPropertyList(oIDPIDFromURL[0]);
          this.loadOrgTeamMembers(oIDPIDFromURL[0]);
        }else{
          this.loadOrganizationByID(this.organizationID);
          this.getPropertyList(this.organizationID);
          this.loadOrgTeamMembers(this.organizationID);
        }

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
      protocol: ['',Validators.required],
      website: ['', [Validators.required, Validators.pattern(urlRegex)]],
      logourl: ['']
    });
    this.inviteUserOrgForm = this.formBuilder.group({
      emailid: ['', [Validators.required, Validators.pattern]],
      firstname: ['', [this.selectusertype ? Validators.required : '']],
      lastname: ['', [this.selectusertype ? Validators.required : '']],
      permissions: ['', [Validators.required]]
    });
    this.inviteUserOrgForm.get("emailid").valueChanges
    .subscribe(data=> {
      this.changeValidators();
    })
    this.editOrganisationForm = this.formBuilder.group({
      organizationName: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      taxID: [''],
      addressOne: ['', [Validators.required]],
      addressTwo: [''],
      city: ['', [Validators.required, Validators.pattern(strRegx)]],
      state: ['', [Validators.required, Validators.pattern(strRegx)]],
      zipcode: ['', [Validators.required, Validators.pattern(zipRegex)]],
      email: ['', [Validators.required, Validators.pattern]],
      phone: ['', [Validators.maxLength(15), Validators.pattern(phoneNumRegx)]]
    });
    this.confirmationForm = this.formBuilder.group({
      userInput: ['', [Validators.required]]
    });
   // this.loadUserListForInvitation();
    this.onGetOrgPlan();
    this.protocol = 'https://';
    //this.organisationPropertyForm.controls['protocol'].setValue(this.protocol, {onlySelf: true});
    this.organisationPropertyForm.patchValue({
      protocol:this.protocol
    })
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
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
      this.userID = data.response.uid;
      if(data.response.license_id){
        this.loadOrganizationLicenseNameByID(this.organizationID,data.response.license_id)
      }
    });
    // this.pathValues();
  }

  onGetOrgPlan() {
    this.loading.start('2');
    this.dataService.getOrgPlanDetails(this.constructor.name, moduleName.cookieConsentModule, this.organizationID)
      .subscribe((res: any) => {
        this.orgPlanDetails = res.response;
        this.loading.stop('2');
      }, error => {
        this.loading.stop('2');
      });
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
      return this.propertyList = data.response;
    });
  }

  async open(content, type) {

    let quickLinkObj = {
      linkid: this.quickDivID,
      indexid: 1,
      isactualbtnclicked: true,
      islinkclicked: true
    };
    
    if (type === 'invite') {
      if (! await this.onCheckSubscription()) {
        return false;
      }
      this.isUpdateUserinvitation = false;
    }
    this.propertyname = '';
    this.website = '';
    this.logourl = '';
    this.isInviteFormSubmitted = false;
    this.inviteUserOrgForm.get('emailid')[this.isUpdateUserinvitation ? 'disable' : 'enable']();
    this.isEditProperty = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.quickmenuService.onClickEmitQSLinkobj.next(quickLinkObj);
    this.quickmenuService.updateQuerymenulist(quickLinkObj);

  }

  editModalPopup(content, data) {
    this.isEditProperty = true;
    // this.selectedOrg = data;
    let extractProtocol;
    let onlywebsitename;
    if(data.website.indexOf('//') !== -1){
      extractProtocol = data.website.split('//');
      this.protocol = extractProtocol[0] + '//';
    }else{
      onlywebsitename = data.website;
    }
    const urlname = extractProtocol !== undefined ? extractProtocol[1] : onlywebsitename;
    this.propertyname = data.name.replace(/&amp;/g,'&');
    this.website = data.website;
    this.logourl = data.logo_url;
    this.myContext = { oid: data.oid, pid: data.id };
    this.organisationPropertyForm.controls['protocol'].setValue(this.protocol);
    this.organisationPropertyForm.controls['propertyname'].setValue(this.propertyname);
    this.organisationPropertyForm.controls['website'].setValue(urlname);
    this.organisationPropertyForm.controls['logourl'].setValue(data.logo_url);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      this.organisationPropertyForm.reset();


      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.organisationPropertyForm.reset();
      this.organisationPropertyForm.patchValue({
        protocol:'https://'
      })
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
        tax_id: this.editOrganisationForm.value.taxID,
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
          this.loadOrganizationByID(this.organizationID);
          if (res.response.id === this.currentManagedOrgID) {
            this.orgService.updateEditedOrganization(res);
          }
          this.orgService.isOrganizationUpdated.next(true);
          this.modalService.dismissAll('Data Saved!');
        }
      }, (error) => {
        this.alertMsg = error;
        this.modalService.dismissAll('Data Saved!');
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
          website: this.organisationPropertyForm.value.protocol + this.organisationPropertyForm.value.website,
          logo_url: this.organisationPropertyForm.value.logourl
        };
        this.orgService.addProperties(this.organizationID, reqObj).subscribe((result) => {
          if (result) {
            this.alertMsg = 'New property has been added!';
            this.isOpen = true;
            this.alertType = 'success';
            this.getPropertyList(this.organizationID);
            this.orgService.isOrganizationUpdated.next(true);
            this.organisationPropertyForm.patchValue({
              protocol:this.protocol
            })
          }
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
        });
        this.submitted = false;
        this.organisationPropertyForm.reset();
        this.modalService.dismissAll('Data Saved!');
        this.checkForQsTooltip();
      } else {
        const reqObj = {
          name: this.organisationPropertyForm.value.propertyname,
          website: this.organisationPropertyForm.value.protocol + this.organisationPropertyForm.value.website,
          logo_url: this.organisationPropertyForm.value.logourl
        };
        this.orgService.editProperties(this.myContext.oid, this.myContext.pid, reqObj).subscribe((res) => {
          if (res) {
            this.alertMsg = 'Property has been updated!';
            this.isOpen = true;
            this.alertType = 'success';
            this.getPropertyList(res.response.oid);
            this.orgService.isPropertyUpdated.next(true);
            if (res.response.id === this.currrentManagedPropID) {
              this.orgService.changeCurrentSelectedProperty(res);
              res['user_id'] = this.userID;
              res['organization_name'] = this.organizationName;
              this.orgService.setCurrentOrgWithProperty(res);
              const orgDetails = this.orgService.getCurrentOrgWithProperty();
              this.orgService.isPropertyUpdated.next(true);
              this.orgService.updateEditedProperty(res);
            }
          }
          // this.orgService.isOrganizationUpdated.next(true);
          this.organisationPropertyForm.reset();
          this.modalService.dismissAll();
          this.submitted = false;
          this.checkForQsTooltip();
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
          this.onCancelClickProperty();
        });
        this.checkForQsTooltip();
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
    const pagelimit = '?limit=' + this.propertyPageConfig.itemsPerPage + '&page=' + this.propertyPageConfig.currentPage;
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


  onCheckSubscription(){
    this.loading.start('2');
    return new Promise(resolve => {
      this.dataService.getOrgAndPropPlanInfo(this.constructor.name, moduleName.cookieConsentModule, this.organizationID)
        .subscribe((res: any) => {
          this.loading.stop('2');
          const status = this.dataService.checkUserForOrg(this.orgPlanDetails, this.paginationConfig.totalItems, res.response.plan_details);
          if (status === false) {
            // return false;
            resolve(false);
          }
          // return true;
          resolve(true);
        }, error => {
          this.loading.stop('2');
          resolve(false);
        });
    });
  }

  onSubmitInviteUserOrganization() {
    this.isInviteFormSubmitted = true;
    let requestObj;
    if (this.inviteUserOrgForm.invalid) {
      return false;
    } else {
      if (!this.isUpdateUserinvitation) {
        if(!this.onCheckSubscription()){
          return false;
        }
        if(this.selectusertype){
         requestObj = {
            firstname: this.inviteUserOrgForm.value.firstname.trim(),
            lastname: this.inviteUserOrgForm.value.lastname.trim(),
            email: this.inviteUserOrgForm.value.emailid.trim(),
            role_id: this.inviteUserOrgForm.value.permissions.trim(),
            orgid: this.organizationID,
            user_level: 'organization'
          };
        }else{
         requestObj = {
            email: this.inviteUserOrgForm.value.emailid.trim(),
            role_id: this.inviteUserOrgForm.value.permissions.trim(),
            orgid: this.organizationID,
            user_level: 'organization'
          };
        }
        this.loading.start();
        this.companyService.inviteUser(this.constructor.name, moduleName.organizationDetailsModule, requestObj)
          .subscribe((data) => {
            this.loading.stop();
            if (data) {
              this.alertMsg = data.response || data.error;
              this.isOpen = true;
              this.alertType = 'success';
              this.loadOrgTeamMembers(this.organizationID);
              this.onCancelClick();
              this.onGetOrgPlan();
            }
          }, (error) => {
            this.loading.stop();
            this.alertMsg = JSON.stringify(error);
            this.isOpen = true;
            this.alertType = 'danger';
            this.onCancelClick();
          });
      } else {
        let useremail = this.inviteUserOrgForm.getRawValue().emailid;
        const requestObj = {
          id: this.recordID,
          user_id: this.approverID,
          email: useremail,
          role_id: this.inviteUserOrgForm.value.permissions,
          firstname: this.inviteUserOrgForm.value.firstname,
          lastname: this.inviteUserOrgForm.value.lastname,
          orgid: this.organizationID,
          user_level: 'organization',
          action:'edit'
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
        const organizationLevelRoles = data[key].filter((t) => t.role_name.indexOf('Org') != -1);
        this.roleList = organizationLevelRoles
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
          this.onGetOrgPlan();
        }
      }, (err) => {
        this.alertMsg = err;
        this.isOpen = true;
        this.alertType = 'danger';
      });
  }

  removeTeamMember(obj, control: string) {
    obj['user_level']='organization';
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
    this.companyService.resendInvitation(this.constructor.name, moduleName.organizationDetailsModule, userid, this.organizationID)
      .subscribe((data) => {
        if (data) {
          this.alertMsg = data.response;
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
    this.isUpdateUserinvitation = true;
    this.recordID = data.id;
    this.approverID = data.approver_id;
    this.inviteUserOrgForm.controls['emailid'].setValue(data.user_email);
    this.inviteUserOrgForm.get('emailid')[this.isUpdateUserinvitation ? 'disable' : 'enable']();
    this.inviteUserOrgForm.controls['permissions'].setValue(data.role_id);
    this.inviteUserOrgForm.controls['firstname'].setValue(this.separateUsername(data.user_name)[0]);
    this.inviteUserOrgForm.controls['lastname'].setValue(this.separateUsername(data.user_name)[1]);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.inviteUserOrgForm.reset();
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.inviteUserOrgForm.reset();
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onCancelClick() {
    this.modalService.dismissAll('Canceled');
    this.isInviteFormSubmitted = false;
    this.isUpdateUserinvitation = false;
    this.selectusertype = true;
    this.isconfirmationsubmitted = false;
    this.inviteUserOrgForm.reset();
    this.confirmationForm.reset();
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  onCancelClickProperty() {
    this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true, urlchanged:false });
    this.quickDivID = "";
    this.submitted = false;
    this.modalService.dismissAll('Canceled');
    this.organisationPropertyForm.patchValue({
      protocol:'https://'
    })
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
      this.onCanceled();
    });
    // } else {
    //   alert('aaa');
    // }
  }

  onCanceled(){
    this.isconfirmationsubmitted = false;
    this.modalService.dismissAll('Canceled');
    this.confirmationForm.reset();
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
          //this.router.navigate(['settings/organizations']);
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

  separateUsername(username){
      let res = username.split(" ");
      return res;
  }

  loadOrganizationLicenseNameByID(orgid,licenseID){
   this.orgService.getOrganizationLicenseNameByID(orgid,licenseID).subscribe((data)=>{
    this.orgLicensedPlanName = data.response[0].name + " " + data.response[0].cycle;
   })
  }

  redirectToManageLicense(){
    this.router.navigate(['/settings/billing/manage'],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
  }

  changeValidators() {
    if (this.selectusertype) {
      this.inviteUserOrgForm.controls["firstname"].setValidators([Validators.required]);
      this.inviteUserOrgForm.controls["lastname"].setValidators([Validators.required]);
    } else {
      this.inviteUserOrgForm.controls["firstname"].clearValidators();
      this.inviteUserOrgForm.controls["lastname"].clearValidators();
    }
    this.inviteUserOrgForm.get("firstname").updateValueAndValidity();
    this.inviteUserOrgForm.get("lastname").updateValueAndValidity();
  }

  showQuickstartTooltip(){
    const a = this.quickmenuService.getQuerymenulist();
    this.quickmenuService.onClickEmitQSLinkobj.pipe(
      takeUntil(this.unsubscribeAfterUserAction$)
    ).subscribe((res) => { 
      if (a.length !== 0) {
        const idx = a.findIndex((t) => t.index == 1);
        if (a[idx].quicklinks.some((t) => t.linkid == res.linkid && t.isactualbtnclicked)) {
          this.quickDivID = res.linkid;
        } else if(a[idx].quicklinks.some((t) => t.linkid == res.linkid && !t.isactualbtnclicked)) {
          this.quickDivID = res.linkid; // for revisited link
        }
      }
    });
    this.unsubscribeAfterUserAction$.next();
    this.unsubscribeAfterUserAction$.complete();
  }

  checkForQsTooltip(){
    this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true,urlchanged:true}); 
    this.quickDivID = "";
  }

  ngAfterViewInit(){
    this.showQuickstartTooltip();
    this.userService.isRevisitedQSMenuLink.subscribe((status) => { this.isRevistedLink = status.reclickqslink; this.currentLinkID = status.quickstartid; this.iswindowclicked = status.urlchanged  });
    this.cdref.detectChanges();
  }

  ngOnDestroy(){
    this.quickDivID = "";
    this.unsubscribeAfterUserAction$.unsubscribe();
  }

  // ngAfterContentChecked() {
  //   this.cdref.detectChanges();
  // }

}
