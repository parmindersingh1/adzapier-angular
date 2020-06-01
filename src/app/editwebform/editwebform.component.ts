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
  checkBoxValues: any = [];
  selectOptionValues: any = [];
  footerText: any;
  welcomeText: any;
  headerlogoURL: any;
  headerColor: any;
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

    this.organizationService.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.selectedProperty = response.property_name;
        this.organizationID = response.organization_id;
        this.propertyId = response.property_id;
      } else {
        const orgDetails = this.organizationService.getCurrentOrgWithProperty();
        // this.currentOrganization = orgDetails.organization_name;
        this.selectedProperty = orgDetails.property_name;
        this.organizationID = orgDetails.organization_id;
        this.propertyId = orgDetails.property_id;
        this.loading = false;
      }
    });
  //  this.getCCPAdefaultConfigById();
    this.loadRequestWebForm();
  }


  getCCPAdefaultConfigById() {
    this.ccpaRequestService.getCCPAdefaultRequestSubjectType().subscribe((data) => {
      if (data !== undefined) {
        const key = 'response';
        const rdata = data[key].request_type;
        const sdata = data[key].subject_type;
        this.requestType = rdata;
        this.subjectType = sdata;
        this.loadRequestWebForm();
        this.loading = false;
      }
    }, (error) => {
      console.log(JSON.stringify(error));
    });
 
  }


  loadRequestWebForm() { 
    this.ccpaFormConfigService.getCCPAFormConfigByID(this.organizationID, this.propertyId, this.crid)
    .subscribe((data) => {
      console.log(data, 'data..');
      if (data.response.length === 0) {
        return this.webFormControlList.length = 0;
      } else {
        const key = 'request_form';
        const fname = 'form_name';
        this.propertyId = data.response.PID;
        this.crid = data.response.crid;
        this.organizationID = data.response.OID;
        this.webFormControlList = data.response[key];
        this.formName = data.response[fname];
        this.webFormControlList.filter((t) => {
          if (t.controlId === 'footertext') {
            this.footerText = t.footerText;
          } else if (t.controlId === 'welcometext') {
            this.welcomeText = t.welcomeText;
          } else if (t.controlId === 'headerlogo') {
            this.headerlogoURL = t.logoURL;
            this.headerColor = t.headerColor;
            // this.hea
          }
        });
        return this.webFormControlList;
      }
    }, (error) => {
      alert(JSON.stringify(error));
      console.log(error, 'get error..');
    });
  }

  register(customerData: NgForm) {
    // console.log(this.requestObject, 'requestObject..');
    // console.log(customerData.value, 'CD...form..');
    // console.log(this.checkBoxValues, 'checkBoxValues..');
    const formData = [];
    let finalObj;
    formData.push(customerData.value);
    // console.log(formData, 'formData..');
    const arryObj = Object.keys(customerData.value);
    // console.log(arryObj, 'obj..');
    const keyArray = this.extractKeyWithIndex(formData);
   
    if (keyArray.length > 0) {
      const clientObject = this.removeExtraObjectKeys(formData);
      finalObj = this.reAssignKeyValue(keyArray, clientObject);
      console.log(finalObj, 'finalObj..');
    } else {
      finalObj = formData[0];
    }



    if (this.checkBoxValues.length > 0) {
      for (const key in finalObj) {
        if (key === 'subject_type') {
          const filtered = this.checkBoxValues.filter((t) => t.subject_type_id !== undefined);
          console.log(filtered, 'filtered..11');
          const result = filtered.map(a => a.subject_type_id);
          finalObj[key] = result;
        } else if (key === 'request_type') {
          const filtered = this.checkBoxValues.filter((t) => t.request_type_id !== undefined);
          console.log(filtered, 'filtered..22');
          const result = filtered.map(a => a.request_type_id);
          finalObj[key] = result;
        } else if (finalObj[key] === true) {
          const filtered = this.checkBoxValues.filter((t) => t.keylabel === key);
          const result = filtered.map(a => a.name);
          finalObj[key] = result; 
        }
      }
    }
    console.log(finalObj,'finalObj..');
    // return false;
    this.ccpadataService.createCCPAData(this.organizationID, this.propertyId, this.crid, finalObj)
      .subscribe((data) => {
        if (data) {
          alert('Data Submitted!');
        }
      }, (err) => {
        alert(JSON.stringify(err));
      });
  }

  removeExtraObjectKeys(indexData) {
    Object.keys(indexData[0]).forEach((k) => {
      if (k.includes('Index')) {
        delete indexData[0][k];
      }
    });

    return indexData[0];

  }

  extractKeyWithIndex(indexData) {
    const indexArray = [];
    let t;
    Object.keys(indexData[0]).forEach((k) => {
      if (k.includes('_Index')) {
        indexArray.push(k.replace('_Index', ''));
      } else if (k.includes('_IndexIndex')) {
        indexArray.push(k.replace('_IndexIndex', ''));
      } else if (k.includes('Index')) {
        indexArray.push(k.replace('Index', ''));
      }
    });
    console.log(indexArray, 'indexArray..');
    return indexArray;

  }


  reAssignKeyValue(array, data) {
    const keys = Object.keys(data);
    const newData = {};
    for (let a = 0; a < array.length; a++) {
      newData[array[a]] = data[keys[a]];

      data[array[a]] = data[keys[a]];
      delete data[keys[a]];
    }

    return newData;
  }


  onCheckboxChange(type) {
    const index = this.checkBoxValues.indexOf(type);
    if (index === -1) {
      this.checkBoxValues.push(type);
    } else {
      this.checkBoxValues.splice(index, 1);
    }

  }

  findIndexToUpdate(type) {
    return type.id === this;
  }

  onChangeSelection(e) {
    this.selectOptionValues.push(e);
  }

}
