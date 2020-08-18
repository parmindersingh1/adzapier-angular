import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { switchMap, flatMap, map } from 'rxjs/operators';
import { CCPAFormConfigurationService } from 'src/app/_services/ccpaform-configuration.service';
import { OrganizationService } from 'src/app/_services';
import { Observable } from 'rxjs';
import { CCPAFormFields } from 'src/app/_models/ccpaformfields';
import { NgxUiLoaderService } from 'ngx-ui-loader';


interface WebFormModel {
  crid: any;
  form_name: string;
  form_status: string;
  OID: any;
  PID: any;
  active: boolean;
  settings: any;
  workflow: any;
  approver: any;
  days_left: number;
  created_at: string;
  updated_at: string;
  request_form: CCPAFormFields;
}

@Component({
  selector: 'app-webforms',
  templateUrl: './webforms.component.html',
  styleUrls: ['./webforms.component.scss']
})
export class WebformsComponent implements OnInit {
  selectedProperty: any;
  currentOrgID: any;
  propertyID: any;
  currentPropertyName: any;
  formList: any = []; // Observable<WebFormModel[]>;
  // loading = false;
  mySubscription;
  currentOrganization: any;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  constructor(private ccpaFormConfigService: CCPAFormConfigurationService,
    private organizationService: OrganizationService,
    private loading: NgxUiLoaderService,
    private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.loadCurrentProperty();
      }
    });
  }

  ngOnInit() {
    // this.loading = true;
    this.loadCurrentProperty();
  }

  loadCurrentProperty() {
    this.organizationService.currentProperty.subscribe((data) => {
      if (data !== '') {
        this.currentOrganization = data.organization_name;
        this.currentPropertyName = data.property_name;
        this.getCCPAFormList(data);
      } else {
        const orgDetails = this.organizationService.getCurrentOrgWithProperty();
        this.currentOrganization = orgDetails.organization_name;
        this.currentPropertyName = orgDetails.property_name;
        this.getCCPAFormList(orgDetails);
      }
    });

  }

  getCCPAFormList(orgDetails) {

    this.loading.start();
    //  const orgDetails = this.organizationService.getCurrentOrgWithProperty();
    // console.log(orgDetails.organization_id,'orgid..',orgDetails.property_id,'prid..');
    if (orgDetails !== undefined) {
      this.ccpaFormConfigService.getCCPAFormList(orgDetails.organization_id, orgDetails.property_id)
        .subscribe((data) => {
          this.loading.stop();
          if (data.response.length !== 0) {
          
            this.formList = data.response;
            // this.loading = false;
            return this.formList;
          } else {
            return this.formList.length = 0;
            //  this.loading = false;

          }
        }, (error) => {
          this.alertMsg = error;
          this.isOpen = true;
          this.alertType = 'danger';
          // this.loading = false;
        });
    }
  }

  showForm(data) {
    this.ccpaFormConfigService.captureCurrentSelectedFormData(data);
    this.router.navigate(['/privacy/dsar/dsarform', data.crid]);
  }

  navigateToDSARForm() {
    if (this.currentPropertyName !== undefined) {
      this.router.navigate(['/privacy/dsar/dsarform']);
    } else {
      alert('Please Select property first!');
    }
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  // ngOnDestroy() {
  //   if (this.mySubscription) {
  //     this.mySubscription.unsubscribe();
  //   }
  // }
}
