import { Component, OnInit, OnDestroy } from '@angular/core';
import { CCPAFormConfigurationService } from '../_services/ccpaform-configuration.service';
import { OrganizationService } from '../_services/organization.service';
import { Router, NavigationEnd } from '@angular/router';
import { switchMap, flatMap } from 'rxjs/operators';

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
  formList: any = [];
  loading = false;
  mySubscription;
  constructor(private ccpaFormConfigService: CCPAFormConfigurationService,
              private organizationService: OrganizationService,
              private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.organizationService.currentProperty.subscribe((data) => {
      if (data !== '') {
        this.currentPropertyName = data.property_name;
        this.getCCPAFormList();
        this.loading = false;
      } else {
        const orgDetails = this.organizationService.getCurrentOrgWithProperty();
        this.getCCPAFormList();
       // this.currentOrganization = orgDetails.organization_name;
        this.currentPropertyName = orgDetails.property_name;
        this.loading = false;
      }

    });
  }


  getCCPAFormList() {
   // this.loading = true;
    this.formList.length = 0;
    const orgDetails = this.organizationService.getCurrentOrgWithProperty();
  //  console.log(orgDetails,'orgdetails..');
    if (orgDetails !== undefined) {
      this.ccpaFormConfigService.getCCPAFormList(orgDetails.organization_id, orgDetails.property_id)
      .subscribe((data) => {
        if (data.response.length === 0) {
          this.loading = false;
          return this.formList.length = 0;
        } else {
          this.formList = data.response;
          this.loading = false;
          return this.formList;
        }
      }, (error) => {
        console.log(error, 'get error..');
        this.loading = false;
      });
    }
  }

  showForm(data) {
    this.ccpaFormConfigService.captureCurrentSelectedFormData(data);
    this.router.navigate(['/dsarform', { crid: data.crid }]);
  }

  // ngOnDestroy() {
  //   if (this.mySubscription) {
  //     this.mySubscription.unsubscribe();
  //   }
  // }
}