import { Component, OnInit } from '@angular/core';
import { CCPAFormConfigurationService } from '../_services/ccpaform-configuration.service';
import { OrganizationService } from '../_services/organization.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-webforms',
  templateUrl: './webforms.component.html',
  styleUrls: ['./webforms.component.scss']
})
export class WebformsComponent implements OnInit {
  selectedProperty: any;
  currentOrgID: any;
  propertyID: any;
  formList: any = [];
  constructor(private ccpaFormConfigService: CCPAFormConfigurationService,
              private organizationService: OrganizationService,
              private router: Router) { }

  ngOnInit() {
    this.organizationService.currentProperty.subscribe((data) => {
      console.log(data, 'data..prp..');
      this.currentOrgID = data.orgId;
      this.propertyID = data.property.propid;
      // this.selectedProperty = data;
    });
    this.getCCPAFormList();
    // this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
    // console.log(this.selectedProperty,'ngoninit...');
  }


  getCCPAFormList() {
    this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
    //  this.organizationService.getOrganization.subscribe((response) => this.currentOrgID = response);
    // console.log(this.currentOrgID,'currentOrgID..');
    console.log(this.selectedProperty, 'selectedProperty..');
    this.formList.length = 0;
    this.ccpaFormConfigService.getCCPAFormList(this.currentOrgID, this.propertyID)
      .subscribe((data) => {
        this.formList.push(data);
        console.log(this.formList, 'fl..');
      }, (error) => console.log(error, 'get error..'));
  }

  showForm(data) {
    this.ccpaFormConfigService.captureCurrentSelectedFormData(data);
    this.router.navigate(['/editwebforms', {crid: data.crid}]);
  }
}
// { crid: data.crid, oid: data.OID, pid: data.PID, propertyname: data.form_name }