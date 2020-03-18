import { Component, OnInit, NgModule } from '@angular/core';
import { FormGroup, Validators, FormsModule, FormBuilder } from '@angular/forms';
import { OrganizationService, UserService } from '../_services';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrgProperties } from '../_models/orgproperties';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderComponent } from '../_components/layout/header/header.component';

@Component({
  selector: 'app-orgpage',
  templateUrl: './orgpage.component.html',
  styleUrls: ['./orgpage.component.scss']
})
@NgModule({
  imports: [
    FormsModule
  ]

})

export class OrgpageComponent implements OnInit {
  organisationPropertyForm: FormGroup;
  submitted: boolean;
  orgList: any;
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
  myContext;
  isEditProperty: boolean;
  constructor(private formBuilder: FormBuilder, private orgservice: OrganizationService, private modalService: NgbModal,
              private sanitizer: DomSanitizer, private userService: UserService
  ) { }

  ngOnInit() {
    this.isEditable = false;
    this.isEditProperty = false;
    this.organisationPropertyForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern]],
      website: ['', [Validators.required, Validators.pattern]],
      logo: ['']
    });

    this.loadOrganizationList();
  }
  get f() { return this.organisationPropertyForm.controls; }

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

      if (!data) {
        this.orgservice.addProperties(this.selectedOrg.orgid, fd).subscribe((result) => {
          this.getPropertyList(this.selectedOrg.orgid);
        }, (error) => {
          console.log(error, 'error..');
        });
        this.organisationPropertyForm.reset();
        this.modalService.dismissAll('Data Saved!');
      } else {
        this.orgservice.editProperties(data.oid, data.pid, fd).subscribe((data) => {
          alert('updated!');
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
      this.orgList = Object.values(data)[0];
    });
  }

  edit(data) {
    console.log(data, 'data..');
    this.isEditable = !this.isEditable;
  }

  saveUpdatedChanges(orgId, data) {
    this.orgservice.updateOrganization(orgId, data).subscribe((data) => {
      if (data) {
        alert('Organization updated successfully!');
        this.isEditable = false;
      }
    }, (error) => {
      alert('error while updating');
    });

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

  getPropertyList(id) {
    this.isOpen = !this.isOpen;
    this.btnText = "Hide";
    this.orgservice.getPropertyList(id).subscribe((data) => {
      this.propertyList = data.response;
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


}
