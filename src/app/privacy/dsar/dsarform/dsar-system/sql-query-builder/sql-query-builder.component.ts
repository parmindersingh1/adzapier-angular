import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  EventEmitter
} from '@angular/core';
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
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  step = [1];
  isTesting = false;
  tableListKey = '';
  tableList = [];
  skLoadingArray = [1,2, 3,4, 5,6, 1,2, 3,4];
  @Input('formObject') formObject;
  @Input('formID') formID;
  @Input('connectionId') connectionId;
  @Input('systemName') systemName;
  @Output('backHome') backHome = new EventEmitter();
  updateData = null;
  sqlSelectField = [];
  tableColumnsListKey = '';
  tableColumnsList = [];
  sqlPageStep = 1;
  query = {
    condition: 'and',
    rules: []
  };
  skLoading = {
    one: true,
    two: false
  };
  systemList = [];
  config: QueryBuilderConfig = {
    fields: {}
  };
  tableName = null;
  orgID = null;
  isUpdate = false;
  constructor(private modalService: BsModalService,
              private loading: NgxUiLoaderService,
              private cd: ChangeDetectorRef,
              private systemIntegrationService: SystemIntegrationService,
              private activatedRoutes: ActivatedRoute
              ) { }

  ngOnInit(): void {
    this.activatedRoutes.queryParams.subscribe(params => {
      this.orgID =  params.oid;
    });
    this.onFindTables();
    this.onGetSavedData();

  }

  onGetSavedData() {
    this.systemIntegrationService.GetQueryBuilderData(this.constructor.name,
      moduleName.systemIntegrationModule, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
      if (res.status === 200) {
        if (res.response.length > 0) {
          this.updateData = res.response;
          this.isUpdate = true;
        }
      }
    });
  }
  onFindTables(){
    this.skLoading.one = true;
    this.systemIntegrationService.GetSqlTables(this.constructor.name, this.connectionId, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.loading.stop();
        this.skLoading.one = false;
        if (res.status === 200) {
          this.tableList = res.response;
          this.tableListKey = res.columns[0];
        }
      }, error => {
        this.skLoading.one = false;
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.formObject = changes.formObject.currentValue;
    this.cd.detectChanges();
  }

  onSelectTable(tableName) {

    this.tableName = tableName;
    if (!tableName) {
      this.step = [1];
      this.sqlPageStep = 1;
      return false;
    }
    // this.loading.start();
    const params = {
      table: tableName
    };
    this.cd.detectChanges();
    this.step.push(2);
    this.skLoading.two = true;
    this.systemIntegrationService.GetSqlTableColumns(this.constructor.name, this.connectionId, params, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        // this.loading.stop();
        this.skLoading.two = false;
        if (res.status === 200) {
          this.sqlSelectField = [];
          this.tableColumnsList = res.response;
          this.tableColumnsListKey = res.columns[0];
          this.onCreateSqlBuilder();
        }
      }, error => {
        this.isOpen = true;
        this.alertMsg = 'Unable to get columns';
        this.alertType = 'danger';
        this.step = [1];
        this.sqlPageStep = 1;
        this.skLoading.two = false;
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
  }

  onSelectField(field) {
    const  sqlSelectField = [...this.sqlSelectField];
    if (!sqlSelectField.includes(field)) {
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
      {field: 'select', value_1: JSON.stringify(this.sqlSelectField), system_name: this.systemName},
      {field: 'where', value_1: JSON.stringify(this.query), system_name: this.systemName},
      {field: 'table', value_1: this.tableName, system_name: this.systemName}
    ];
    this.loading.start();
    this.systemIntegrationService.saveQueryBuilder(this.constructor.name, moduleName.systemIntegrationModule, payload, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
      this.loading.stop();
      if (res.status === 201) {
              this.sqlPageStep = 2;
              this.isOpen = true;
              this.alertMsg = 'Record Saved';
              this.alertType = 'info';
      }
    }, error => {
      this.loading.stop();
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    })
  }
  onConnectionListPage() {
    this.backHome.emit(true)
  }
}
