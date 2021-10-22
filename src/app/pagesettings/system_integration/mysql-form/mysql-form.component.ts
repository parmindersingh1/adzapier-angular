import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SystemIntegrationService} from '../../../_services/system_integration.service';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import {credForm } from '../integration_cred.constant';
import {$e} from 'codelyzer/angular/styles/chars';

@Component({
  selector: 'app-mysql-form',
  templateUrl: './mysql-form.component.html',
  styleUrls: ['./mysql-form.component.scss']
})
export class MysqlFormComponent implements OnInit {
  oID: any;
  pID: any;
  connectionList = [];
  submitType = 'test';
  @Input('systemID') systemID;
  @Input('systemName') systemName;
  @Output('refreshConnectionList') refreshConnectionList = new EventEmitter()
  connectionID: any;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  showConnectionForm = false;
  isTesting = false;
  mySqlForm: FormGroup;
  submitted = false;
  testingSuccess = '';
  testEmail = '';
  credForm = credForm;
  constructor(private formBuilder: FormBuilder,
              private systemIntegrationService: SystemIntegrationService,
              private activatedroute: ActivatedRoute,
              private loading: NgxUiLoaderService
  ) {

  }

  ngOnInit() {
    this.activatedroute.queryParams
      .subscribe((params: any) => {
        this.oID = params.oid;
        this.pID = params.pid;
      });
    this.mySqlForm = this.formBuilder.group({
      connection_name: ['', Validators.required],
      connection_desc: ['', Validators.required],
      connector_type: ['', Validators.required],
      credential: this.formBuilder.array([]),
    });
    this.onGetConnectionList();
    // for (const data of mysqlForm) {
    for (let i = 0; credForm[this.systemName].length > i; i++) {
      this.addCredentialRows.push(this.addCredential(i));
    }
  }

  addCredential(index) {
    return this.formBuilder.group({
      key: [credForm[this.systemName][index].key, Validators.required],
      secret_1: ['', Validators.required],
    });
  }

  get addCredentialRows() {
    return this.mySqlForm.get('credential') as FormArray;
  }


  onGetConnectionList() {
    this.systemIntegrationService.GetConnectionListBySystemID(this.constructor.name, moduleName.systemIntegrationModule, this.systemID)
      .subscribe((res: any) => {
        this.connectionList = res.response;
      })
  }


  get f() {
    return this.mySqlForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.mySqlForm.invalid) {
      return;
    }

    const payload = {
      cred_name: this.mySqlForm.value.connection_name,
      description: this.mySqlForm.value.connection_desc,
      connector_type: this.mySqlForm.value.connector_type,
      integration_cred: this.mySqlForm.value.credential
    };
    if (this.submitType === 'test') {
      this.onTestConnection(payload);
    } else {
      this.onSaveCred(payload);
    }
  }

  onTestConnection(payload) {
    this.loading.start();
    const params: any = {
      system: this.systemName
    };
    if (this.systemName === 'mailchimp'
      || this.systemName === 'Activecampaign'
      || this.systemName === 'sendinblue'
      || this.systemName === 'sendgrid'
      || this.systemName === 'hubspot'
      || this.systemName === 'moosend') {
      params.email = this.testEmail;
    }
    this.isTesting = true;
    this.testingSuccess = '';
    this.systemIntegrationService.TestSystemIntegration(this.constructor.name,
      moduleName.systemIntegrationModule, this.systemID, payload, params)
      .subscribe((res: any) => {
        this.loading.stop();
        this.isTesting = false;
        if (res.status === 200) {
          this.testingSuccess = res.message;
          if (this.systemName === 'http') {
            alert('API RESPONSE::::::' + JSON.stringify(res.apiResponse));
          }
        }
        this.alertMsg = '';

      }, error => {
        this.testingSuccess = '';
        this.isTesting = false;
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'error';
        this.loading.stop();
      });
  }

  onSaveCred(payload) {
    this.loading.start();
    this.systemIntegrationService.SaveSystemIntegration(this.constructor.name,
      moduleName.systemIntegrationModule, this.systemID, payload)
      .subscribe(res => {
        this.loading.stop();
        this.refreshConnectionList.emit();
      }, error => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'error';
      });
  }

  onReset() {
    this.submitted = false;
    this.mySqlForm.reset();
  }

  hideConnectionForm() {
    this.onGetConnectionList();
    this.showConnectionForm = false;
  }

  onSetTestEmail(event: any) {
    this.testEmail = event.target.value;
  }
}
