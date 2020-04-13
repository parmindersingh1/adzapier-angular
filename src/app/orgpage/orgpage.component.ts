import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OrganizationService, UserService } from '../_services';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';

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
  propname: any;
  websitename: any;
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
              private userService: UserService
  ) { }

  ngOnInit() {
    this.isEditable = false;
    this.isEditProperty = false;
    this.organisationPropertyForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern]],
      website: ['', [Validators.required, Validators.pattern]],
      logo: ['']
    });
    this.editOrganisationForm = this.formBuilder.group({
      orgname: [''],
      taxID: [''],
      address1: [''],
      address2: [''],
      city: [''],
      state: [''],
      zipcode: ['']
    });
    this.loadOrganizationList();
  }
   get f() { return this.organisationPropertyForm.controls; }
   get f1() { return this.editOrganisationForm.controls; }
  uploadFile(event) {
    console.log(event, 'event..');
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.organisationPropertyForm.get('logo').setValue(file);
    }
  }

  get name() { return this.organisationPropertyForm.get('name'); }
  get website() { return this.organisationPropertyForm.get('website'); }
  onSubmit(data) {
    const fd = new FormData();
    fd.append('name', this.organisationPropertyForm.get('name').value);
    fd.append('website', this.organisationPropertyForm.get('website').value);
    fd.append('logo', this.organisationPropertyForm.get('logo').value);
   
    if (this.organisationPropertyForm.valid) {
      if (!this.isEditProperty) {
        this.orgservice.addProperties(this.selectedOrg.orgid, fd).subscribe((result) => {
          this.getPropertyList(this.selectedOrg.orgid);
        }, (error) => {
          console.log(error, 'error..');
        });
        this.organisationPropertyForm.reset();
        this.modalService.dismissAll('Data Saved!');
      } else {
        this.orgservice.editProperties(this.myContext.oid, this.myContext.pid, fd).subscribe((res) => {
          if (res) {
            alert('updated!');
            this.getPropertyList(res.oid);
          }
          this.organisationPropertyForm.reset();
          this.modalService.dismissAll();
        }, (error) => {
          console.log(error, 'error..');
        });
      }
    } else {
      alert('not filled..');
    }

  }

  loadOrganizationList() {
    this.orgservice.orglist().subscribe((data) => {
      console.log(JSON.stringify(data),'data..');
      this.orgList = Object.values(data)[0];
    });
  }

  edit(data) {
    this.isEditable = !this.isEditable;
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
    console.log(this.editOrganisationForm.value, 'value..');
    if (this.editOrganisationForm.valid) {
      const obj = {
        orgname: this.editOrganisationForm.get('orgname').value,
        taxID: this.editOrganisationForm.get('taxID').value,
        address1: this.editOrganisationForm.get('address1').value,
        address2: this.editOrganisationForm.get('address2').value,
        city: this.editOrganisationForm.get('city').value,
        state:  this.editOrganisationForm.get('state').value,
        zipcode: this.editOrganisationForm.get('zipcode').value
      };
      this.orgservice.updateOrganization(data.oid, obj).subscribe((res) => {
        if (res) {
          this.orgservice.emitUpdatedOrganization.emit(res);
          alert('Organization updated successfully!');
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

  open(content, data) {
    this.propname = '';
    this.websitename = '';
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
      return this.propertyList = data.response;
    });
  }

  transform(imgData) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

  editModalPopup(content, data) {
    this.isEditProperty = true;
    // this.selectedOrg = data;
    this.propname = data.propname;
    this.websitename = data.website;
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
      alert('edit mp..');
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

}
