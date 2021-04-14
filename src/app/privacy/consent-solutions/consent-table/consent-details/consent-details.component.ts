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



}
