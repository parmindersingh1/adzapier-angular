import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {LazyLoadEvent} from 'primeng/api';
import {moduleName} from '../../../../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {SystemIntegrationService} from '../../../../../_services/system_integration.service';
import {QueryBuilderConfig} from 'angular2-query-builder';

@Component({
  selector: 'app-sql-query-builder',
  templateUrl: './sql-query-builder.component.html',
  styleUrls: ['./sql-query-builder.component.scss']
})
export class SqlQueryBuilderComponent implements OnInit {
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
  @Input('systemName') systemName;
  @Input('systemID') systemID;
  connectionID = null;
  tableListKey = '';
  tableList = [];

  tableColumnsListKey = '';
  tableColumnsList = [];


  query = {
    condition: 'and',
    rules: []
  };

  config: QueryBuilderConfig = {
    fields: {}
  };
  constructor(private modalService: BsModalService,
              private loading: NgxUiLoaderService,
              private systemIntegrationService: SystemIntegrationService
              ) { }

  ngOnInit(): void {
    this.onGetCredList();
  }
  onGetCredList() {
    this.loading.start();
    this.systemIntegrationService.GetCredListBySystem(this.constructor.name, this.systemID, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.loading.stop();
        this.credList = res.response;
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
    const payload = {
      limit: this.eventRows,
      page: this.firstone
    };
    // this.systemIntegrationService.GetSystemList()
  }
  onTestConnection(data) {
    this.currentScanId = data.id;
    const integrationCred = [];
    for (const cred of data.integration_auth) {
      integrationCred.push({
        key: cred.key,
        secret_1: cred.secret_1
      });
    }
    const payload = {
      cred_name: data.cred_name,
      description: data.description,
      connector_type: data.connector_type,
      integration_auth: integrationCred
    };
    this.loading.start();
    const params = {
      system: this.systemName
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

  onSelectConnection(connectionId) {
    this.step = 2;
    this.connectionID = connectionId;
    this.loading.start();
    this.systemIntegrationService.GetSqlTables(this.constructor.name, connectionId, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.loading.stop();
        if (res.status === 200) {
          this.tableList = res.response;
          this.tableListKey = res.columns[0];
        }
      });
  }


  onSelectTable(tableName) {
    this.loading.start();
    const params = {
      table: tableName
    };
    this.systemIntegrationService.GetSqlTableColumns(this.constructor.name, this.connectionID, params, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.loading.stop();
        if (res.status === 200) {
          this.tableColumnsList = res.response;
          this.tableColumnsListKey = res.columns[0];
          this.onCreateSqlBuilder();
        }
      });
  }
  onCreateSqlBuilder() {
    // config: QueryBuilderConfig = {
    //   fields: {
    //     age: {name: 'Age', type: 'string'},
    //   }
    // };
    this.query.rules.push({field: this.tableColumnsList[0][this.tableColumnsListKey], operator: '<=', value: ''});
    for (const column of this.tableColumnsList) {
      this.config.fields[column[this.tableColumnsListKey]] = {name: column[this.tableColumnsListKey], type: 'string'};
    }

    this.step = 3;
    console.log('this.query', this.query)
    console.log('this.this.config', this.config)
  }

}
