import {ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {moduleName} from '../../../../_constant/module-name.constant';
import {SystemIntegrationService} from '../../../../_services/system_integration.service';
import {LazyLoadEvent} from 'primeng/api';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {QueryBuilderConfig} from 'angular2-query-builder';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-dsar-system',
  templateUrl: './dsar-system.component.html',
  styleUrls: ['./dsar-system.component.scss']
})
export class DsarSystemComponent implements OnInit {
  modalRef: BsModalRef;
  eventRows = 10;
  credList = [];
  firstone = 1;
  currentScanId = null;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  step = 1;
  isTesting = false;
  connectionID = null;
  tableListKey = '';
  tableList = [];
  @Input('formObject') formObject;
  @Input('formID') formID;
  systemName = '';
  currentSystem = {
    id: null,
    name: null
  };
  query = {
    condition: 'and',
    rules: []
  };
  systemList = [];
  config: QueryBuilderConfig = {
    fields: {}
  };
  orgID = null;
  mailChimpData = {} as any;
  credCount: any = 0;
  skLoading = false;
  skLoadingArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  @ViewChild('mailChimpConnection', {static: true}) mailChimpConnection;
  mailChimpForm: FormGroup;
  submitted = false;

  constructor(private systemIntegrationService: SystemIntegrationService,
              private loading: NgxUiLoaderService,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    console.log('formObject', this.formObject);
    this.onGetSystemList();
    this.onGetCredList();
    this.mailChimpForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }
  get f() { return this.mailChimpForm.controls; }

  onGetSystemList() {
    this.systemIntegrationService.GetSystemList(this.constructor.name, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.systemList = res.response;
      }, error => {
      });
  }
  onGetCredList() {
    // this.loading.start('step2');
    const payload = {
      limit: this.eventRows,
      page: this.firstone
    };
    this.skLoading = true;
    this.systemIntegrationService.GetCredListByCompany(this.constructor.name,  moduleName.systemIntegrationModule, payload)
      .subscribe((res: any) => {
        this.skLoading = false;
        // this.loading.stop('step2');
        this.credList = res.response;
        this.credCount = res.count;
        this.cd.detectChanges();

      }, error => {
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'error';
        this.skLoading = false;
        // this.loading.stop('step2');
      });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true});
  }

  loadCarsLazy(event: LazyLoadEvent) {
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.onGetCredList();
  }
  onTestConnection(data, systemID) {
    if (this.onFindSystemName(systemID) === 'mailchimp') {
      this.mailChimpData = data;
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
        this.isOpen = true;
        this.alertMsg = res.message;
        this.alertType = 'success';
        // this.alertMsg = '';
        this.loading.stop();
      }, error => {
        this.isTesting = false;
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
      });
  }
  onRefreshList() {
    this.modalRef.hide();
    this.onGetCredList();
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

  onSelectConnection(connectionId, systemID) {
    this.step = 2;
    this.connectionID = connectionId;
    this.systemName = this.onFindSystemName(systemID);
  }
  onHome(e) {
    this.systemName = '';
  }

  onSelectSystem(obj, step) {
    this.currentSystem = {
      id: obj.id,
      name: obj.name
    };
    this.step = step;
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
        this.isOpen = true;
        this.alertMsg = res.message;
        this.alertType = 'success';
        // this.alertMsg = '';
        this.loading.stop();
        this.modalRef.hide();
      }, error => {
        this.isTesting = false;
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
        this.loading.stop();
        this.modalRef.hide();
      });
  }

}
