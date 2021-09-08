import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {LazyLoadEvent} from 'primeng/api';
import {moduleName} from '../../../../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {SystemIntegrationService} from '../../../../../_services/system_integration.service';
import {QueryBuilderConfig} from 'angular2-query-builder';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sql-query-builder',
  templateUrl: './sql-query-builder.component.html',
  styleUrls: ['./sql-query-builder.component.scss']
})
export class SqlQueryBuilderComponent implements OnInit, OnChanges {
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
  sqlSelectField = [];
  tableColumnsListKey = '';
  tableColumnsList = [];
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
  constructor(private modalService: BsModalService,
              private loading: NgxUiLoaderService,
              private cd: ChangeDetectorRef,
              private systemIntegrationService: SystemIntegrationService,
              private activatedRoutes: ActivatedRoute
              ) { }

  ngOnInit(): void {
    this.activatedRoutes.queryParams.subscribe(params => {
      this.orgID =  params.oid;
    })
    this.onGetSystemList();
    this.onGetCredList();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.formObject = changes.formObject.currentValue;
    this.cd.detectChanges();
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
    const queryOption = [];
    for (const option of this.formObject.request_form) {
      queryOption.push({name: 'Form.' + option.controllabel, value: option.controlId});
    }
    this.query.rules.push({field: this.tableColumnsList[0][this.tableColumnsListKey],  operators: ['=', '<=', '>'], value: ''});
    for (const column of this.tableColumnsList) {
      this.config.fields[column[this.tableColumnsListKey]] = {name: column[this.tableColumnsListKey], type: 'category',  operators: ['=', '<=', '>'], options: queryOption};
    }

    this.step = 3;
    console.log('this.query', this.query)
    console.log('this.this.config', this.config)
  }

  onSelectField(event, field) {
    const checked = event.target.checked;
    const  sqlSelectField = [...this.sqlSelectField];
    if (checked) {
      sqlSelectField.push(field);
    } else {
      const index = this.sqlSelectField.indexOf(field);
      if (index > -1) {
        sqlSelectField.splice(index, 1);
      }
    }
    this.sqlSelectField = sqlSelectField;
  }
  onSaveSqlBuilder() {
    const payload = [
      {field: 'select', value_1: JSON.stringify(this.sqlSelectField)},
      {field: 'where', value_1: JSON.stringify(this.query)}
    ];
    this.systemIntegrationService.saveQueryBuilder(this.constructor.name, moduleName.systemIntegrationModule, payload, this.orgID, this.connectionID).subscribe(res => {

    })
  }
}
