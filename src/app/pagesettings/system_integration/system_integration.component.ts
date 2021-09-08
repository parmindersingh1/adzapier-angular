import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {LazyLoadEvent} from 'primeng/api';
import {SystemIntegrationService} from '../../_services/system_integration.service';
import {moduleName} from '../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';


@Component({
  templateUrl: './system_integration.component.html',
  styleUrls: ['./system_integration.component.scss'],
  selector: 'app-system-integration'
})

export class SystemIntegrationComponent implements OnInit {
  modalRef: BsModalRef;
  cols: any[];
  virtualCars: [];
  cars = [];
  systemList = [];
  credList = [];
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
  constructor(private modalService: BsModalService,
              private systemIntegrationService: SystemIntegrationService,
              private loading: NgxUiLoaderService
  ) {
  }

  ngOnInit() {
    this.onGetSystemList();
  }

  onGetSystemList() {
    this.systemIntegrationService.GetSystemList(this.constructor.name, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.systemList = res.response;
        this.onGetCredList();
      })
  }

  onGetCredList() {
    this.loading.start();
    this.systemIntegrationService.GetCredListByCompany(this.constructor.name, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.loading.stop();
        this.credList = res.response;
      });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true});
  }

  openModalUpdateConnection(template: TemplateRef<any>, obj) {
    this.updateSystemName = this.onFindSystemName(obj.system_id);
    this.updateConnectionData = obj;
    this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true});
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
}
