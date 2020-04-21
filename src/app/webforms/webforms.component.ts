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
  formList: any = [];
  constructor(private ccpaFormConfigService: CCPAFormConfigurationService,
              private organizationService: OrganizationService,
              private router: Router) {
  //  this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
   // console.log(this.selectedProperty,'constructor..');
   this.organizationService.currentProperty.subscribe((data)=>this.selectedProperty = data);
  }

  ngOnInit() {
    this.organizationService.currentProperty.subscribe((data)=>this.selectedProperty = data);
   // this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
   // console.log(this.selectedProperty,'ngoninit...');
  }


  getCCPAFormList() {
    this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
    //  this.organizationService.getOrganization.subscribe((response) => this.currentOrgID = response);
    // console.log(this.currentOrgID,'currentOrgID..');
    console.log(this.selectedProperty, 'selectedProperty..');
    this.formList.length = 0;
    this.ccpaFormConfigService.getCCPAFormList(this.selectedProperty.orgId, this.selectedProperty.property.propid)
      .subscribe((data) => {
        this.formList.push(data);
        console.log(this.formList,'fl..');
      } 
        , (error) => console.log(error, 'get error..'));
  }

  showForm(data) {
     this.router.navigate(['/editwebforms', {crid: data.crid, oid:data.OID,pid:data.PID, propertyname: this.selectedProperty.property.propName }]);
   // this.router.navigateByUrl('/editwebforms', { state: data });

   // console.log(data,'data..');
  }
}
