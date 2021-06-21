import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Location} from '@angular/common';
import {ConsentSolutionsService} from '../../../../_services/consent-solutions.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {moduleName} from '../../../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-consentlegal-table',
  templateUrl: './consent-details.component.html',
  styleUrls: ['./consent-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsentDetailsComponent implements OnInit {
  consentData: any;
  consentPrefrenseList = [];
  consentRecordList = [];
  modalRef: BsModalRef;
  proofFormConsent = '';
  consentDataId = '';
  consentDatafirstname = '';
  consentDatalastname = '';
  consentDataemail = '';
  consentDatads = '';
  consentDatacountry = '';
  consentDataowner = '';
  consentDataip = '';
  consentDatacreated = '';
  consentDataupadted = '';
  consentDatanews = '';
  consentDataprivacy = '';

  editConsentForm: FormGroup;
  submitted = false;
  dismissible = true;
  alertMsg: any;
  isEdit = false;
  isOpen = false;
  alertType: any;
  planDetails: any;

  constructor(private consentSolutionService: ConsentSolutionsService,
              private formBuilder: FormBuilder,
              private loading: NgxUiLoaderService,
              private location: Location, private modalService: BsModalService) {
  }

  ngOnInit() {
    try {
      this.consentSolutionService.consentSolutionDetails.subscribe(res => {
        if (res === null) {
          this.location.back();
        }
        if (Object.keys(res).length > 0) {
          this.consentData = res;
        }
      }, error => {
        console.error(error);
      });
    } catch (err) {
      console.log('Could not found consent Record OR Component State Lost');
    }
    this.initForm();
  }

  initForm() {
    this.editConsentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      dataSource: ['', Validators.required],
      country: ['', Validators.required],
      ownerID: [''],
      ipAddress: ['', Validators.required],
    });
  }


  get f() {
    return this.editConsentForm.controls;
  }

  onUpdateConsent() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.editConsentForm.invalid) {
      return;
    }

    const payloads = {
      owner_id: this.editConsentForm.value.ownerID,
      email: this.editConsentForm.value.email,
      first_name: this.editConsentForm.value.firstName,
      last_name: this.editConsentForm.value.lastName,
      verified: this.consentData.verified,
      optout: this.consentData.optout,
      country: this.editConsentForm.value.country,
      data_source: this.editConsentForm.value.dataSource,
      ip_address: this.editConsentForm.value.ipAddress
    };
    this.loading.start();
    this.consentSolutionService.updateConsent(this.constructor.name, moduleName.consentSolutionModule, payloads, this.consentData.id)
      .subscribe((res: any) => {
        this.loading.stop();
        if (res.status === 200) {
          this.consentData.owner_id = this.editConsentForm.value.ownerID;
          this.consentData.email = this.editConsentForm.value.email;
          this.consentData.first_name = this.editConsentForm.value.firstName;
          this.consentData.last_name = this.editConsentForm.value.lastName;
          this.consentData.country = this.editConsentForm.value.country;
          this.consentData.data_source = this.editConsentForm.value.dataSource;
          this.consentData.ip_address = this.editConsentForm.value.ipAddress;
          this.isOpen = true;
          this.alertMsg = res.message;
          this.alertType = 'success';
          this.modalRef.hide();
        }
      }, err => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = err.message;
        this.alertType = 'danger';
      });
    // display form values on success
  }

  editUser(edit, proofs) {
    this.proofFormConsent = proofs.form;
    this.modalRef = this.modalService.show(edit, {});
  }

  editConsentDetails(editdetails) {
    this.editConsentForm.patchValue({
      firstName: this.consentData.first_name,
      lastName: this.consentData.last_name,
      email: this.consentData.email,
      dataSource: this.consentData.data_source,
      country: this.consentData.country,
      ownerID: this.consentData.owner_id,
      ipAddress: this.consentData.ip_address
    });
    this.modalRef = this.modalService.show(editdetails, {});
  }


}
