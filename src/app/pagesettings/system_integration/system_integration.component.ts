import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {LazyLoadEvent} from 'primeng/api';
import {SystemIntegrationService} from '../../_services/system_integration.service';
import {moduleName} from '../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Title } from '@angular/platform-browser';


@Component({
  templateUrl: './system_integration.component.html',
  styleUrls: ['./system_integration.component.scss'],
  selector: 'app-system-integration'
})

export class SystemIntegrationComponent implements OnInit {
  @ViewChild('mailChimpConnection', {static: true}) mailChimpConnection;
  modalRef: BsModalRef;
  cols: any[];
  virtualCars: [];
  cars = [];
  systemList = [];
  credList = [];
  mailChimpData = {} as any;
  currentSystem = {
    id: null,
    name: null
  };
  step = 1;
  eventRows;
  firstone;
  testingSuccess = false;
  isTesting = false;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  currentScanId = null;
  updateConnectionData = null;
  updateSystemName = null;
  testEmail = '';
  skLoading = false;
  skLoadingArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  mailChimpForm: FormGroup;
  submitted = false;
  credCount: any = 0;
  errorMessage = '';
  constructor(private modalService: BsModalService,
              private systemIntegrationService: SystemIntegrationService,
              private loading: NgxUiLoaderService,
              private formBuilder: FormBuilder,
              private titleService: Title 

  ) {
    this.titleService.setTitle("System Integration - Adzapier Portal");

  }

  ngOnInit() {
    this.onGetSystemList();
    this.mailChimpForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  get f() {
    return this.mailChimpForm.controls;
  }


  onGetSystemList() {
    this.skLoading = true;
    this.systemIntegrationService.GetSystemList(this.constructor.name, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.skLoading = false;
        this.systemList = res.response;
        this.onGetCredList();
      }, error => {
        this.skLoading = false;
      });
  }

  onGetCredList() {
    this.loading.start();
    this.skLoading = true;
    const payload = {
      limit: this.eventRows,
      page: this.firstone
    };
    this.systemIntegrationService.GetCredListByCompany(this.constructor.name, moduleName.systemIntegrationModule, payload)
      .subscribe((res: any) => {
        this.skLoading = false;
        this.loading.stop();
        this.credList = res.response;
        this.credCount = res.count;
      }, error => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'error';
        this.skLoading = false;
        this.loading.stop();
      });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true});
  }

  openModalUpdateConnection(template: TemplateRef<any>, obj) {
    this.mailChimpForm.reset();
    this.updateSystemName = this.onFindSystemName(obj.system_id);
    this.updateConnectionData = obj;
    this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true});
  }

  loadLazyData(event: LazyLoadEvent) {
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.onGetCredList();
  }

  onSelectSystem(obj, step) {
    this.currentSystem = {
      id: obj.id,
      name: obj.name
    };
    this.step = step;
  }

  onFindSystemName(systemID) {
    let systemName = '';
    for (const system of this.systemList) {
      if (system.id === systemID) {
        systemName = system.name;
      }
    }
    return systemName;
  }

  onTestConnection(data, systemID) {
    if (this.onFindSystemName(systemID) === 'mailchimp'
      || this.onFindSystemName(systemID) === 'sendinblue'
      || this.onFindSystemName(systemID) === 'sendgrid'
      || this.onFindSystemName(systemID) === 'activecampaign'
      || this.onFindSystemName(systemID) === 'hubspot'
      || this.onFindSystemName(systemID) === 'moosend') {
      this.mailChimpData = data;
      this.mailChimpForm.reset();
      this.openModal(this.mailChimpConnection);
      return false;
    }
    this.currentScanId = data.id;
    const integrationCred = [];
    for (const cred of data.integration_cred) {
      integrationCred.push({
        key: cred.key,
        secret_1: cred.secret_1
      });
    }
    const payload = {
      cred_name: data.cred_name,
      description: data.description,
      connector_type: data.connector_type,
      integration_cred: integrationCred
    };
    this.loading.start();
    const params = {
      system: this.onFindSystemName(data.system_id)
    };
    this.isTesting = true;
    this.isOpen = false;
    this.alertMsg = '';
    this.alertType = '';
    this.systemIntegrationService.TestSystemIntegration(this.constructor.name,
      moduleName.systemIntegrationModule, data.system_id, payload, params)
      .subscribe((res: any) => {
        this.isTesting = false;
        this.testingSuccess = true;
        this.isOpen = true;
        this.alertMsg = res.message;
        this.alertType = 'success';
        // this.alertMsg = '';
        this.loading.stop();
      }, error => {
        this.testingSuccess = false;
        this.isTesting = false;
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
      });
  }

  onRefreshList() {
    this.step = 1;
    this.modalRef.hide();
    this.onGetCredList();
  }

  onTestMailChimp() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.mailChimpForm.invalid) {
      return;
    }
    const data = {...this.mailChimpData};
    this.currentScanId = data.id;
    const integrationCred = [];
    for (const cred of data.integration_cred) {
      integrationCred.push({
        key: cred.key,
        secret_1: cred.secret_1
      });
    }
    const payload = {
      cred_name: data.cred_name,
      description: data.description,
      connector_type: data.connector_type,
      integration_cred: integrationCred
    };
    this.loading.start();
    const params = {
      system: this.onFindSystemName(data.system_id),
      email: this.mailChimpForm.value.email
    };
    this.isTesting = true;
    this.isOpen = false;
    this.alertMsg = '';
    this.alertType = '';
    this.systemIntegrationService.TestSystemIntegration(this.constructor.name,
      moduleName.systemIntegrationModule, data.system_id, payload, params)
      .subscribe((res: any) => {
        this.isTesting = false;
        this.testingSuccess = true;
        this.isOpen = true;
        this.alertMsg = res.message;
        this.alertType = 'success';
        this.errorMessage = '';
        this.loading.stop();
        this.mailChimpForm.reset();
        this.modalRef.hide();
      }, error => {
        this.testingSuccess = false;
        this.isTesting = false;
        this.loading.stop();
        this.errorMessage = error;
      });
  }
  onResetTestEmailForm(){
    this.modalRef.hide();
    this.errorMessage = '';
    this.mailChimpForm.reset();
  }
}
