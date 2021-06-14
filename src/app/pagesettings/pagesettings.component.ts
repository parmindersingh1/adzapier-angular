import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../_services/data.service';
@Component({
  selector: 'app-pagesettings',
  templateUrl: './pagesettings.component.html',
  styleUrls: ['./pagesettings.component.scss']
})
export class PagesettingsComponent implements OnInit {
  @ViewChild('confirmTemplate') confirmModal: TemplateRef<any>;
  modalRef: BsModalRef;
  isPropertyCreated;
  constructor(private router: Router,
              private bsmodalService: BsModalService, 
              private dataService: DataService) { 
                this.dataService.OrganizationCreatedStatus.subscribe((status) => {
                  this.isPropertyCreated = status;
                });
              }

  ngOnInit() {
  }

  goto(link) {
    if (link.indexOf('billing') !== -1) {
      const checkStatusOnPageRefresh = this.dataService.getOrganizationPropertyCreationStatus();
      if (!this.isPropertyCreated && checkStatusOnPageRefresh) { 
        return true;
      }
      if (!this.isPropertyCreated) {
        this.openModal(this.confirmModal);
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.bsmodalService.show(template, { class: 'modal-sm' });
  }
  confirm() {
    this.modalRef.hide();
    this.router.navigate(['settings/organizations']);
  }

}
