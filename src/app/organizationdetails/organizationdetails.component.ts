import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService, UserService } from '../_services';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '../company.service';
@Component({
  selector: 'app-organizationdetails',
  templateUrl: './organizationdetails.component.html',
  styleUrls: ['./organizationdetails.component.scss']
})
export class OrganizationdetailsComponent implements OnInit {
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
  i: any = [];
  pageSize: any;
  myconfig = { itemsPerPage: 3 || this.i, currentPage: this.p };
  propertyList: any;
  isOpen: boolean = false;
  submitted;
  isEditProperty: boolean;
  propertyname: any;
  website: any;
  logourl: any;
  myContext;
  isInviteFormSubmitted:any;
  organizationTeamMemberList: any
  roleList: any;
  constructor(private activatedRoute: ActivatedRoute,
              private orgService: OrganizationService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private userService: UserService) { }

  ngOnInit() {
    this.loadRoleList();
    this.loadCompanyTeamMembers();
    this.activatedRoute.paramMap.subscribe(params => {
      this.organizationID = params.get('id');
      console.log(this.organizationID,'organizationID..');
    });
    this.loadOrganizationByID(this.organizationID);
    this.getPropertyList(this.organizationID);
    this.isEditProperty = false;
    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const zipRegex = '^[0-9]*$'; //'^[0-9]{6}(?:-[0-9]{4})?$';
    const strRegx = '^[a-zA-Z \-\']+';
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    this.organisationPropertyForm = this.formBuilder.group({
      propertyname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      website: ['', [Validators.required, Validators.pattern(urlRegex)]],
      logourl: ['']
    });
    this.inviteUserOrgForm = this.formBuilder.group({
      emailid: ['', [Validators.required]],
      permissions: new FormArray([])
    });
  }
  get orgProp() { return this.organisationPropertyForm.controls; }
  loadOrganizationByID(id) {
    this.orgService.getOrganizationByID(id).subscribe((data) => {
      this.organizationName = data.response.orgname;
      this.addressOne = data.response.address1;
      this.addressTwo = data.response.address2;
      this.city = data.response.city;
      this.state = data.response.state;
      this.taxID = data.response.tax_id;
      this.zipcode = data.response.zipcode;
    });
  }

  getPropertyList(id): any {
    this.isOpen = !this.isOpen;
    this.orgService.getPropertyList(id).subscribe((data) => {
      this.orgService.emitUpdatedOrgList.emit(data.response);
      if (!data.response) {
        alert("Adding property is mandatory. Add Property first.");
      }

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

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      alert('edit mp..');
      this.organisationPropertyForm.reset();
     // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.organisationPropertyForm.reset();
     // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit() {
    this.submitted = true;

    // const fd = new FormData();
    // fd.append('name', this.organisationPropertyForm.get('name').value);
    // fd.append('website', this.organisationPropertyForm.get('website').value);
    // fd.append('logo_url', this.organisationPropertyForm.get('logo_url').value);
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
            alert('New property has been added');
            this.getPropertyList(this.organizationID);
          }
        }, (error) => {
          console.log(error, 'error..');
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
            alert('Property has been updated!');
            this.getPropertyList(res.response.oid);
          }
          this.organisationPropertyForm.reset();
          this.modalService.dismissAll();
        }, (error) => {
          console.log(error, 'error..');
        });
      }
    }

  }

  
  pageChangeEvent(event) {
    this.myconfig.currentPage = event;
  }

  onChangeEvent(event) {
		this.myconfig.itemsPerPage = Number(event.target.value);
  }

  onCheckChange(event) {
    const formArray: FormArray = this.inviteUserOrgForm.get('permissions') as FormArray;
    const index =  formArray.value.indexOf(event.target.value);
    if (index === -1) {
      formArray.push(new FormControl(event.target.value));
    } else {
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value === event.target.value) {
          formArray.removeAt(index);
          return;
        } 
      });
    }
    console.log(formArray.value,'fcv..');
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

  loadRoleList() {
    this.userService.getRoleList().subscribe((data) => {
      if (data) {
        const key = 'response';
       // const roleid = data[key];
        this.roleList = data[key];
      }
    });
  }

  loadCompanyTeamMembers() {
    const key = 'response';
    this.companyService.getCompanyTeamMembers().subscribe((data) => {
      this.organizationTeamMemberList = data[key];
    });
  }

}
