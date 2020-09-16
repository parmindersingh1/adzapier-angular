import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { OrganizationService, UserService } from '../_services';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrganizationService } from 'src/app/_services/organization.service';
import { CompanyService } from 'src/app/company.service';
import { UserService } from 'src/app/_services/user.service';
// import { CompanyService } from '../company.service';
@Component({
  selector: 'app-organizationdetails',
  templateUrl: './organizationdetails.component.html',
  styleUrls: ['./organizationdetails.component.scss']
})
export class OrganizationdetailsComponent implements OnInit {
  @ViewChild('propertyModal', { static: true }) propertyModal: TemplateRef<any>;

  organisationPropertyForm: FormGroup;
  editOrganisationForm: FormGroup;
  inviteUserOrgForm: FormGroup;
  organizationID: any;
  organizationDetails: any;
  organizationName: any;
  addressOne: any;
  addressTwo: any;
  city: string;
  state: string;
  zipcode: number;
  taxID: any;

  p: number = 1;
  pageSize: any = 5;
  totalCount: any;
  paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount, id: 'userPagination' };

  p2: number = 1;
  propertyPgSize: any = 5;
  propertyTotalCount: any;
  propertyPageConfig = { itemsPerPage: this.propertyPgSize, currentPage: this.p2, totalItems: this.propertyTotalCount, id: 'propertyPagination' };

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
  constructor(private activatedRoute: ActivatedRoute,
              private orgService: OrganizationService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private userService: UserService,
              private router: Router,
              private cdref: ChangeDetectorRef) {
    this.orgService.currentProperty.subscribe((data) => {
      this.currentManagedOrgID = data.organization_id;
      this.currrentManagedPropID = data.property_id;
    });
  }

  ngOnInit() {
    this.orgService.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgService.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
    this.loadRoleList();

    this.activatedRoute.paramMap.subscribe(params => {
      this.organizationID = params.get('id');
      console.log(this.organizationID, 'organizationID..');
      this.loadOrganizationByID(this.organizationID);
      this.getPropertyList(this.organizationID);
      this.loadOrgTeamMembers(this.organizationID);

    });


    this.isEditProperty = false;
    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const zipRegex = '^[0-9]*$'; //'^[0-9]{6}(?:-[0-9]{4})?$';
    const strRegx = '.*\\S.*[a-zA-Z \-\']';
    // const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    const alphaNumeric = '.*\\S.*[a-zA-z0-9 ]';
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
      addressTwo: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.pattern(strRegx)]],
      state: ['', [Validators.required, Validators.pattern(strRegx)]],
      zipcode: ['', [Validators.required, Validators.pattern(zipRegex)]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    });
  }
  get f() { return this.inviteUserOrgForm.controls; }
  get orgProp() { return this.organisationPropertyForm.controls; }
  get editOrg() { return this.editOrganisationForm.controls; }
  loadOrganizationByID(id) {
    this.orgService.getOrganizationByID(id).subscribe((data) => {
      console.log(data, 'data..');
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
    // this.selectedOrg = data;
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
    this.editOrganisationForm.controls['organizationName'].setValue( this.organizationName );
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

  disableProperty(orgId, propId) {
    this.orgService.disableProperty(orgId, propId).subscribe((data) => {
      if (data) {
        this.alertMsg = data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.getPropertyList(this.organizationID);
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
    const key = 'response';
    this.orgService.getOrgTeamMembers(this.organizationID, pagelimit).subscribe((data) => {
      this.organizationTeamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.organizationTeamMemberList;
    });
  }

  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
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
    // this.companyService.getCompanyTeamMembers().subscribe((data) => {
    //   this.organizationTeamMemberList = data[key];
    //   this.paginationConfig.totalItems = data.count;
    //   return this.organizationTeamMemberList;
    // });
  }

  onPagesizeChangeEvent(event) {
    this.propertyPageConfig.itemsPerPage = Number(event.target.value);
  }

  onSubmitInviteUserOrganization() {
    this.isInviteFormSubmitted = true;
    if (this.inviteUserOrgForm.invalid) {
      return false;
    } else {
      const requestObj = {
        email: this.inviteUserOrgForm.value.emailid,
        role_id: this.inviteUserOrgForm.value.permissions,
        orgid: this.organizationID,
        user_level: 'organization'
      };
      this.companyService.inviteUser(requestObj)
        .subscribe((data) => {
          if (data) {
            this.alertMsg = data.response;
            this.isOpen = true;
            this.alertType = 'success';
            this.loadOrgTeamMembers(this.organizationID);
            this.onCancelClick();
          }
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
          this.onCancelClick();
        });
    }
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

  loadOrgTeamMembers(orgID) {
    const key = 'response';
    const pagelimit = '&limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.orgService.getOrgTeamMembers(orgID, pagelimit).subscribe((data) => {
      this.organizationTeamMemberList = data[key];
      this.paginationConfig.totalItems = data.count;
    });
  }

  viewOrganizationTeam() {
    this.router.navigate(['settings/organizations/organizationteam', this.organizationID]);
  }

  disableOrganization() {
    const reqObj = {
      active: false
    };
    this.orgService.disableOrganization(this.organizationID, reqObj).subscribe((data) => {
      if (data) {
        this.alertMsg = data.response;
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
  }

  removeTeamMember(id) {
    this.companyService.removeTeamMember(id).subscribe((data) => {
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

  isDateOrString(status): boolean {
    const date = Date.parse(status);
    if (isNaN(date)) {
      return false;
    }
    return true;
  }
  onResendInvitation(email) {
    const requestObj = {
      email,
      orgid: this.organizationID,
      user_level: 'organization'
    };
    this.companyService.inviteUser(requestObj)
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

  onCancelClick() {
    this.isInviteFormSubmitted = false;
    this.inviteUserOrgForm.reset();
    this.modalService.dismissAll('Canceled');
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
  // ngAfterContentChecked() {
  //   this.cdref.detectChanges();
  // }

}
