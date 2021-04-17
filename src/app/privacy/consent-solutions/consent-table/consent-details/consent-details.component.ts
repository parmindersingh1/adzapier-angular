import {Component, OnInit, ViewEncapsulation,TemplateRef} from '@angular/core';
import {Location} from '@angular/common';
import {ConsentSolutionsService} from '../../../../_services/consent-solutions.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-consentlegal-table',
  templateUrl: './consent-details.component.html',
  styleUrls: ['./consent-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsentDetailsComponent implements OnInit {
  consentData: any;
  consentPrefrenseList = [];
  consentRecordList=[];
  modalRef: BsModalRef;
  proofFormConsent = '';
  consentDataId='';
  consentDatafirstname='';
  consentDatalastname='';
  consentDataemail='';
  consentDatads='';
  consentDatacountry='';
  consentDataowner='';
  consentDataip='';
  consentDatacreated='';
  consentDataupadted='';
  consentDatanews='';
  consentDataprivacy='';




  constructor(private consentSolutionService: ConsentSolutionsService,
              private location: Location,private modalService: BsModalService) {
  }

  ngOnInit() {
    this.consentSolutionService.consentSolutionDetails.subscribe(res => {
      if (res === null) {
        this.location.back();
      }
      if (Object.keys(res).length > 0) {
        this.consentData = res;
      }
      console.log('this.consent', this.consentData);
    }, error => {
      console.error(error);
    });
  }



  editUser(edit, proofs) {


    this.proofFormConsent = proofs.form;

    this.modalRef = this.modalService.show(edit, {});


  }

  editDetails(editdetails , consentData) {

    this.consentDatafirstname=consentData.first_name;
    this.consentDatalastname=consentData.last_name;
    this.consentDataemail=consentData.email;
    this.consentDatads=consentData.data_source;
    this.consentDatacountry=consentData.country;
    this.consentDataowner=consentData.owner_id;
    this.consentDataip=consentData.ip_address;
    this.consentDatacreated=consentData.created_at;
    this.consentDataupadted=consentData.updated_at;
    
    this.modalRef = this.modalService.show(editdetails, {});


  }



}
