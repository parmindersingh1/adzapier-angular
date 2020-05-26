import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OrganizationService, UserService } from '../_services';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-orgpage',
  templateUrl: './orgpage.component.html',
  styleUrls: ['./orgpage.component.scss']
})


export class OrgpageComponent implements OnInit {
  organisationPropertyForm: FormGroup;
  editOrganisationForm: FormGroup;
  submitted: boolean;
  orgList: any = [];
  orgDetails: any = [];
  closeResult: any;
  isEditable: boolean;
  selectedOrg: any;
  selectedImage: File;
  propertyList: any;
  isOpen: boolean = false;
  btnText: string = 'Show';
  editPropertyrow: boolean = false;
  propertyname: any;
  website: any;
  logourl: any;
  organizationname: any;
  taxidnumber: any;
  addressone: any;
  addresstwo: any;
  cityname: any;
  statename: any;
  zipcodenum: any;
  myContext;
  showOrgDetails: boolean = false;
  isEditProperty: boolean;
  isEditOrganization: boolean;
  p: number = 1; 
  pageSize: any = 20;
  totalCount: any;
  paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
  selectedOrganization: any = [];
  searchText;
  ascNumberSort: any;
  constructor(private formBuilder: FormBuilder,
              private orgservice: OrganizationService,
              private modalService: NgbModal, private sanitizer: DomSanitizer,
              private userService: UserService,
              private companyService: CompanyService,
              private router: Router
  ) { }

  ngOnInit() {
    this.isEditable = false;
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
    this.editOrganisationForm = this.formBuilder.group({
      organizationname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      taxidnumber: [''],
      addressone: ['', [Validators.required]],
      addresstwo: ['', [Validators.required]],
      cityname: ['', [Validators.required, Validators.pattern(strRegx)]],
      statename: ['', [Validators.required, Validators.pattern(strRegx)]],
      zipcodenum: ['', [Validators.required, Validators.pattern(zipRegex)]]
    });
    this.loadOrganizationList();

  }
  get orgProp() { return this.organisationPropertyForm.controls; }
  get editOrg() { return this.editOrganisationForm.controls; }

  uploadFile(event) {
    console.log(event, 'event..');
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.organisationPropertyForm.get('logo').setValue(file);
    }
  }

  // get name() { return this.organisationPropertyForm.get('name'); }
  // get website() { return this.organisationPropertyForm.get('website'); }
  // get logo_url() { return this.organisationPropertyForm.get('logo_url'); }
 

  loadOrganizationList() { 
   // this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.orgservice.orglist(pagelimit).subscribe((data) => {
      const key = 'response';
      this.orgList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.orgList;
    });

    // this.orgservice.orglist().subscribe((data) => {
    //   const key = 'response';
    //   this.orgList = data[key];
    //   this.paginationConfig.totalItems = data.count; 
    // });

  }


  loadOrganizationDetails(org) {
    this.orgDetails = [];
    this.showOrgDetails = !this.showOrgDetails;
    this.orgservice.viewOrganizationDetails(org.orgid).subscribe((data) => {
      const key = 'response';
      this.orgDetails.push(data[key]);
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }

  updateOrganisationData(data) {
    this.submitted = true;
    if (this.editOrganisationForm.invalid) {
      return false;
    } else {
      if (this.isEditOrganization) {
      const updateObj = {
        orgname: this.editOrganisationForm.value.organizationname,
        taxID: this.editOrganisationForm.value.taxidnumber,
        address1: this.editOrganisationForm.value.addressone,
        address2: this.editOrganisationForm.value.addresstwo,
        city: this.editOrganisationForm.value.cityname,
        state: this.editOrganisationForm.value.statename,
        zipcode: this.editOrganisationForm.value.zipcodenum
      };
      this.orgservice.updateOrganization(data.oid, updateObj).subscribe((res) => {
        if (res) {
          this.orgservice.emitUpdatedOrganization.emit(res);
          alert('Organization updated successfully!');
          this.orgDetails = [];
          this.showOrgDetails = false;
          this.loadOrganizationList();
          this.isEditable = false;
          this.onResetEditOrganization();
        }
      }, (error) => {
        alert(JSON.stringify(error));
      });
    } else {
      const addObj = {
        orgname: this.editOrganisationForm.value.organizationname,
        taxID: this.editOrganisationForm.value.taxidnumber,
        address1: this.editOrganisationForm.value.addressone,
        address2: this.editOrganisationForm.value.addresstwo,
        city: this.editOrganisationForm.value.cityname,
        state: this.editOrganisationForm.value.statename,
        zipcode: this.editOrganisationForm.value.zipcodenum
      };
      this.orgservice.addOrganization(addObj).subscribe((res) => {
        if (res) {
          this.orgservice.emitUpdatedOrganization.emit(res);
          this.orgservice.setCurrentOrgWithProperty(res);
          this.orgservice.changeCurrentSelectedProperty(res);
          this.viewOrganization(res.response.id);
          alert('Organization Added successfully!');
          this.onResetEditOrganization();
          this.orgDetails = [];
          this.showOrgDetails = false;
          this.loadOrganizationList();
          this.isEditable = false;
        }
      }, (error) => {
        alert(JSON.stringify(error));
      });
    }
    }
    // console.log(this.editOrganisationForm.value, 'value..');
    // if (this.editOrganisationForm.valid) {

    // }
  }

  open(content, data) {
    this.propertyname = '';
    this.website = '';
    this.logourl = '';
    this.selectedOrg = data;
    this.isEditProperty = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getPropertyList(id): any {
    this.isOpen = !this.isOpen;
    this.orgservice.getPropertyList(id).subscribe((data) => {
      this.orgservice.emitUpdatedOrgList.emit(data.response);
      if (!data.response) {
        alert("Adding property is mandatory. Add Property first.");
      }

      return this.propertyList = data.response;
    });
  }

  transform(imgData) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

  editModalPopup(content, data) {
    this.isEditProperty = true;
    // this.selectedOrg = data;
    this.propertyname = data.propname;
    this.website = data.website;
    this.logourl = data.logo_url;
    this.myContext = { oid: data.oid, pid: data.pid };

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      alert('edit mp..');
      this.organisationPropertyForm.reset();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.organisationPropertyForm.reset();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  organizationModalPopup(content, data) {
    if (data !== '') {
      this.isEditOrganization = true;
      this.myContext = { oid: data.id };
      this.organizationname = data.orgname;
      this.taxidnumber = data.taxID;
      this.addressone = data.address1;
      this.addresstwo = data.address2;
      this.cityname = data.city;
      this.statename = data.state;
      this.zipcodenum = data.zipcode;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.editOrganisationForm.reset();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.editOrganisationForm.reset();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.isEditOrganization = false;
      this.organizationname = '';
      this.taxidnumber = '';
      this.addressone = '';
      this.addresstwo = '';
      this.cityname = '';
      this.statename = '';
      this.zipcodenum = '';
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.editOrganisationForm.reset();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.editOrganisationForm.reset();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  }

  onResetEditOrganization() {
    this.editOrganisationForm.reset();
    this.modalService.dismissAll('Data Saved!');
  }

  clickToManage(propertyID) {
    this.router.navigate(['propertydashboard/', propertyID]);
  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.orgservice.orglist(pagelimit).subscribe((data) => {
      const key = 'response';
      this.orgList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.orgList;
    });
  }

  
	onChangeEvent(event) {
		this.paginationConfig.itemsPerPage = Number(event.target.value);
  }
  
  viewOrganization(orgID) {
    this.router.navigate(['/organizationdetails', orgID]);
  }

  removeOrganization(id) {
    this.companyService.removeTeamMember(id).subscribe((data) => {
      if (data) {
        alert('Selected oragnization has been disabled!');
      }
    }, (err) => {
      alert(err);
    });
  }

  manageSelecteditem(data) {
    this.selectedOrganization.length = 0;
    this.selectedOrganization.push(data);
    this.orgservice.changeCurrentManagedOrganization(data);
    
  }

  disableOtherItems(data): boolean {
    return this.selectedOrganization.filter((t) => t.id === data.id).length > 0;
  }

  sortNumberColumn() {
    this.ascNumberSort = !this.ascNumberSort;
    if(this.ascNumberSort) {
        this.orgList.sort((a, b) => a - b); // For ascending sort
    } else {
        this.orgList.sort((a, b) => b - a); // For descending sort
    }
}

}
