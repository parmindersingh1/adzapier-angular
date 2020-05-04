import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CCPAFormConfigurationService } from '../_services/ccpaform-configuration.service';
import { switchMap } from 'rxjs/operators';
import { OrganizationService } from '../_services';
import { CcparequestService } from '../_services/ccparequest.service';
import { FormArray, NgForm } from '@angular/forms';
import { CcpadataService } from '../_services/ccpadata.service';

@Component({
  selector: 'app-editwebform',
  templateUrl: './editwebform.component.html',
  styleUrls: ['./editwebform.component.scss']
})
export class EditwebformComponent implements OnInit {
  public requestObject: any = {};
  public selectedFormOption: any;
  public selectedControlType: any;
  public selectOptions: any;
  public selectOptionText: any;
  public count: number;
  public selectOptionControl: any;
  selectedControlId: any;
  changeControlType: any;
  newAttribute: any = {};
  lblText: any;
  inputOrSelectOption: boolean;
  firstField = true;
  firstFieldName = 'First Item name';
  loading = false;
  crid: any;
  propertyId: any;
  organizationID: any;
  webform: any;
  formName: any;
  public requestType: any = [];
  public subjectType: any = [];
  webFormControlList: any = [];
  selectedProperty: any;
  localStorageCRID: any;
  constructor(private ccpaFormConfigService: CCPAFormConfigurationService,
              private organizationService: OrganizationService,
              private ccpaRequestService: CcparequestService,
              private activatedRoute: ActivatedRoute,
              private ccpadataService: CcpadataService) {
    this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
  }

  ngOnInit() {
    this.loading = true;
    this.localStorageCRID = JSON.parse(localStorage.getItem('crid'));
    this.organizationService.currentProperty.subscribe(data => {
      console.log(JSON.stringify(data), 'currentProperty..');
    });

    this.organizationService.getSelectedOrgProperty.subscribe((response) => this.selectedProperty = response);
    this.activatedRoute.paramMap.subscribe(params => {
      this.crid = params.get('crid');
    });
    this.getCCPAdefaultConfigById();
    
  }


  getCCPAdefaultConfigById() {
    this.organizationService.orglist().pipe(
      switchMap((data) => {
        for (const key in data) {
          if (data[key] !== undefined) {
            return this.ccpaRequestService.getCCPAdefaultRequestSubjectType(data[key][0].orgid);
          }
        }
      })

    ).subscribe((data) => {
      if (data !== undefined) {
        const rdata = data['response'].request_type;
        const sdata = data['response'].subject_type;
        this.requestType = rdata;
        this.subjectType = sdata;
        this.loadRequestWebForm();
        this.loading = false;
      }
    }, (error) => {
      alert(JSON.stringify(error));
    });
  }


  loadRequestWebForm() {

    this.organizationService.currentProperty.pipe(
      // flatMap((res1) => this.currentPropertyName = res1.property.propName),
      switchMap((res1) =>
        this.ccpaFormConfigService.getCCPAFormConfigByID(res1.orgId, res1.property.propid, this.crid)
      )
    ).subscribe((data) => {
      if (data.response.length === 0) {
        return this.webFormControlList.length = 0;
      } else {
      //  console.log(data, 'data..edit..');
        const key = 'request_form';
        const fname = 'form_name';
        this.propertyId = data.response.PID;
        this.crid = data.response.crid;
        this.organizationID = data.response.OID;
        this.webFormControlList = data.response[key];
        this.formName = data.response[fname];
     //   console.log(this.webFormControlList, 'webFormControlList');
        return this.webFormControlList;
      }
      //  console.log(this.formList.length, 'this.formList length..');
      // console.log(this.formList, 'this.formList..');

    }, (error) => {
      alert(JSON.stringify(error));
      console.log(error, 'get error..');
    });
  }

  register(customerData: NgForm) {
    console.log(customerData.value, 'CD...form..');
    const formData = [];
    formData.push(customerData.value);
    const obj =  this.updateWebcontrolIndex(formData);
    this.ccpadataService.createCCPAData(this.organizationID, this.propertyId, this.crid, obj)
    .subscribe((data)=>{
      if (data) {
        alert('Data Submitted!');
      }
    }, (err) => {
      alert(JSON.stringify(err));
    });
  }

  updateWebcontrolIndex(indexData) {
    Object.keys(indexData[0]).forEach((k) => {
      if (k.includes('Index')) {
        delete indexData[0][k];
      }
    });

    return indexData[0];

  } 

}
