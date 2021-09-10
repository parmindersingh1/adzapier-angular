import {ChangeDetectorRef, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {moduleName} from '../../../../_constant/module-name.constant';
import {SystemIntegrationService} from '../../../../_services/system_integration.service';
import {LazyLoadEvent} from 'primeng/api';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {QueryBuilderConfig} from 'angular2-query-builder';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-dsar-system',
  templateUrl: './dsar-system.component.html',
  styleUrls: ['./dsar-system.component.scss']
})
export class DsarSystemComponent implements OnInit {
  modalRef: BsModalRef;
  eventRows;
  credList = [];
  firstone;
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

  query = {
    condition: 'and',
    rules: []
  };
  systemList = [];
  config: QueryBuilderConfig = {
    fields: {}
  };
  orgID = null;
  constructor(private systemIntegrationService: SystemIntegrationService,
              private loading: NgxUiLoaderService,
              private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    console.log('formID', this.formID);
    this.onGetSystemList();
    this.onGetCredList();
  }

  onGetSystemList() {
    this.loading.start('step-1');
    this.systemIntegrationService.GetSystemList(this.constructor.name, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.loading.stop('step-1');
        this.systemList = res.response;
      }, error => {
        this.loading.stop('step-1');
      });
  }
  onGetCredList() {
    this.loading.start('step2');
    this.systemIntegrationService.GetCredListBySystem(this.constructor.name,  moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.loading.stop('step2');
        this.credList = res.response;
        this.cd.detectChanges();

      }, error => {
        this.loading.stop('step2');
      });
  }
  openModal(template: TemplateRef<any>) {
    // this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true});
  }

  loadCarsLazy(event: LazyLoadEvent) {
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    const payload = {
      limit: this.eventRows,
      page: this.firstone
    };
    // this.systemIntegrationService.GetSystemList()
  }
  onTestConnection(data) {
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

}
