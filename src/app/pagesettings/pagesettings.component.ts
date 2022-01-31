import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from '../_services/data.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pagesettings',
  templateUrl: './pagesettings.component.html',
  styleUrls: ['./pagesettings.component.scss']
})
export class PagesettingsComponent implements OnInit {
  @ViewChild('confirmTemplate') confirmModal: TemplateRef<any>;
  modalRef: BsModalRef;
  isPropertyCreated;
  queryOID;
  queryPID;
  constructor(private router: Router,
              private bsmodalService: BsModalService, 
              private activatedRoute: ActivatedRoute,
              private dataService: DataService,
              private titleService: Title 
              ) { 
                this.dataService.OrganizationCreatedStatus.subscribe((status) => {
                  this.isPropertyCreated = status;
                });
                this.titleService.setTitle("Settings - Adzapier Portal");

              }

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
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
    this.router.navigate(['settings/organizations'],{ queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling:'merge', skipLocationChange:false});
  }

}
