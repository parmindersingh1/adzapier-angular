import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OrganizationService, UserService } from '../_services';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orgpage',
  templateUrl: './orgpage.component.html',
  styleUrls: ['./orgpage.component.scss']
})


export class OrgpageComponent implements OnInit {
  organisationPropertyForm: FormGroup;
  editOrganisationForm: FormGroup;
  submitted: boolean;
  orgList: any;
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
  constructor(private formBuilder: FormBuilder,
              private orgservice: OrganizationService,
              private modalService: NgbModal, private sanitizer: DomSanitizer,
              private userService: UserService,
              private router: Router
  ) { }

  ngOnInit() {
    this.isEditable = false;
    this.isEditProperty = false;
    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const zipRegex = '^[0-9]*$'; //'^[0-9]{6}(?:-[0-9]{4})?$';
    const strRegx = '^[a-zA-Z \-\']+';
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9]+$';
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
      statename: ['', [Validators.required,  Validators.pattern(strRegx)]],
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
        this.orgservice.addProperties(this.selectedOrg.orgid, reqObj).subscribe((result) => {
          if (result) {
            alert('New property has been added');
            this.getPropertyList(this.selectedOrg.orgid);
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
        this.orgservice.editProperties(this.myContext.oid, this.myContext.pid, reqObj).subscribe((res) => {
          if (res) {
            alert('updated!');
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

  loadOrganizationList() {
    this.orgservice.orglist().subscribe((data) => {
      this.orgList = Object.values(data)[0];
      this.getPropertyList(this.orgList[0].orgid);
      this.loadOrganizationDetails(this.orgList[0]);
    });
  
  }
 

  loadOrganizationDetails(org) {
    this.orgDetails = [];
    this.showOrgDetails = !this.showOrgDetails;
    this.orgservice.viewOrganizationDetails(org.orgid).subscribe((data) => {
      const key = 'response';
      this.orgDetails.push(data[key]);
    }, (error) => {
      alert(error);
    });
  }
 
  updateOrganisationData(data) {
    this.submitted = true;
    if (this.editOrganisationForm.invalid) {
      return false;
    } else {
      const obj = {
        orgname: this.editOrganisationForm.value.organizationname,
        taxID: this.editOrganisationForm.value.taxidnumber,
        address1: this.editOrganisationForm.value.addressone,
        address2: this.editOrganisationForm.value.addresstwo,
        city: this.editOrganisationForm.value.cityname,
        state:  this.editOrganisationForm.value.statename,
        zipcode: this.editOrganisationForm.value.zipcodenum
      };
      this.orgservice.updateOrganization(data.oid, obj).subscribe((res) => {
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

  

  editOrganizationModalPopup(content, data) {
    this.myContext = { oid: data.oid, pid: data.pid};
    this.organizationname = data.name;
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
  }
  
  onResetEditOrganization() {
    this.editOrganisationForm.reset();
    this.modalService.dismissAll('Data Saved!');
  }

  clickToManage(propertyID) {
    this.router.navigate(['propertydashboard/', propertyID]);
  }
 
}
