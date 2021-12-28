import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SystemIntegrationService} from '../../../_services/system_integration.service';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import {credForm} from '../integration_cred.constant';

@Component({
  selector: 'app-update-rest-api',
  templateUrl: './update-rest-api.component.html',
  styleUrls: ['./update-rest-api.component.scss']
})
export class UpdateRestApiComponent implements OnInit {
  oID: any;
  pID: any;
  connectionList = [];
  submitType = 'test';
  // @Input('systemID') systemID;
  @Input('systemName') systemName;
  @Input('updateConnectionData') updateConnectionData;
  @Output('close') close = new EventEmitter();
  cred = credForm.http;
  @Output('refreshConnectionList') refreshConnectionList = new EventEmitter();
  systemID = null;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  showConnectionForm = false;
  isTesting = false;
  mySqlForm: FormGroup;
  submitted = false;
  testingSuccess = '';

  constructor(private formBuilder: FormBuilder,
              private systemIntegrationService: SystemIntegrationService,
              private activatedroute: ActivatedRoute,
              private loading: NgxUiLoaderService
  ) {

  }

  ngOnInit() {
    this.systemID = this.updateConnectionData.system_id;
    this.activatedroute.queryParams
      .subscribe((params: any) => {
        this.oID = params.oid;
        this.pID = params.pid;
      });
    this.mySqlForm = this.formBuilder.group({
      connection_name: ['', Validators.required],
      connection_desc: ['', Validators.required],
      connector_type: ['', Validators.required],
      method_type: ['', Validators.required],
      full_url: ['', Validators.required],
      authorization: [''],
      token: [''],
    });
    this.mySqlForm.patchValue({
      connection_name: this.updateConnectionData.cred_name,
      connection_desc: this.updateConnectionData.description,
      connector_type: this.updateConnectionData.connector_type
    });
    for (const cred of this.updateConnectionData.integration_cred) {
      if (cred.key === "full_url") {
        this.mySqlForm.patchValue({
          full_url: cred.secret_1
        });
      } else if (cred.key === "authorization_header") {
        this.mySqlForm.patchValue({
          authorization: cred.secret_1
        });
      }  else if (cred.key === "method_type") {
        this.mySqlForm.patchValue({
          method_type: cred.secret_1
        });
      } else if (cred.key === "token") {
        this.mySqlForm.patchValue({
          token: cred.secret_1
        });
      }
    }
  }

  onGetConnectionList() {
    this.systemIntegrationService.GetConnectionListBySystemID(this.constructor.name, moduleName.systemIntegrationModule, this.systemID)
      .subscribe((res: any) => {
        this.connectionList = res.response;
      }, error => {

      });
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
      integration_cred: []
    };
    payload.integration_cred.push({
      key: 'full_url',
      secret_1: this.mySqlForm.value.full_url
    });
    payload.integration_cred.push({
      key: 'authorization_header',
      secret_1: this.mySqlForm.value.authorization
    });
    payload.integration_cred.push({
      key: 'method_type',
      secret_1: this.mySqlForm.value.method_type
    });
    payload.integration_cred.push({
      key: 'token',
      secret_1: this.mySqlForm.value.token
    });
    if (this.submitType === 'test') {
      this.onTestConnection(payload);
    } else {
      this.onUpdateCred(payload);
    }
  }

  onTestConnection(payload) {
    this.loading.start();
    const params: any = {
      system: this.systemName
    };
    if (this.systemName === 'mailchimp'
      || this.systemName === 'activecampaign'
      || this.systemName === 'sendinblue'
      || this.systemName === 'sendgrid'
      || this.systemName === 'hubspot'
      || this.systemName === 'moosend') {
      params.email = this.mySqlForm.value.testEmail;
    }
    this.isTesting = true;
    this.testingSuccess = '';
    this.systemIntegrationService.TestSystemIntegration(this.constructor.name,
      moduleName.systemIntegrationModule, this.systemID, payload, params)
      .subscribe((res: any) => {
        this.isTesting = false;
        if (res.status === 200) {
          this.testingSuccess = res.message;
          if (this.systemName === 'http') {
            alert('API RESPONSE::::::' + JSON.stringify(res.apiResponse));
          }
        }
        this.alertMsg = '';
        this.loading.stop();
      }, error => {
        this.testingSuccess = '';
        this.isTesting = false;
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'error';
        this.loading.stop();
      });
  }

  onUpdateCred(payload) {
    this.loading.start();
    this.systemIntegrationService.UpdateSystemIntegration(this.constructor.name,
      moduleName.systemIntegrationModule, this.systemID, this.updateConnectionData.id, payload)
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
}

