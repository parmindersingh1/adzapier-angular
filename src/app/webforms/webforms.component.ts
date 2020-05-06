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
        this.currentPropertyName = data.property.propName;
        this.getCCPAFormList();
      }

    });
  }


  getCCPAFormList() {
    this.loading = true;
    this.formList.length = 0;

    this.organizationService.currentProperty.pipe(
      // flatMap((res1) => this.currentPropertyName = res1.property.propName),
      switchMap((res1) => this.ccpaFormConfigService.getCCPAFormList(res1.orgId, res1.property.propid)),
    ).subscribe((data) => {
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