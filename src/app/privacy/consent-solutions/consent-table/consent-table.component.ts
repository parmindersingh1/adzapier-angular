import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {OrganizationService} from '../../../_services';
import {ConsentSolutionsService} from '../../../_services/consent-solutions.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import {Router} from '@angular/router';

@Component({
  selector: 'app-consent-solutions',
  templateUrl: './consent-table.component.html',
  styleUrls: ['./consent-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsentTableComponent implements OnInit {
  currentManagedOrgID: any;
  currrentManagedPropID: any;
  consentRecordList = [];
  consentRecordCount = 0;
  private firstone: number;
  eventRows;
  tLoading = true;
  pagelimit;
  planDetails: any;
  constructor(private orgservice: OrganizationService,
              private consentSolutionService: ConsentSolutionsService,
              private loading: NgxUiLoaderService,
              private router: Router
              ) {}

  ngOnInit() {
    this.onGetPropsAndOrgId();
  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
  }

  onGetConsentSolutionData(event) {
    this.tLoading = true;
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
    this.onGetConsentRecord();
  }

  onGetLegalSolutionData(event){
    this.tLoading = true;
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
  }

  onGetConsentRecord() {
    this.loading.start();
    this.consentSolutionService.getConsentRecord(this.constructor.name, moduleName.consentSolutionModule, this.pagelimit, this.currrentManagedPropID)
      .subscribe((res: any) => {
        this.loading.stop();
        const result: any = res;
        if (result.status === 200) {
          this.consentRecordList = result.response;
          this.consentRecordCount = result.count;
        }
      }, error => {
        this.loading.stop();
      });
  }
  async onNavigateToDetails(consentRecord) {
  await  this.consentSolutionService.onPushConsentData(consentRecord);
  await this.router.navigateByUrl('/consent-solutions/consent-records/details/' + consentRecord.id);
  }
}
