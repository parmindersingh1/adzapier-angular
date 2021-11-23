import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {QueryBuilderConfig} from 'angular2-query-builder';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {SystemIntegrationService} from '../../../../../../_services/system_integration.service';
import {ActivatedRoute} from '@angular/router';
import {moduleName} from '../../../../../../_constant/module-name.constant';

@Component({
  selector: 'app-update-sql-query-builder',
  templateUrl: './update-sql-query-builder.component.html',
  styleUrls: ['./update-sql-query-builder.component.scss']
})
export class UpdateSqlQueryBuilderComponent implements OnInit, OnChanges {
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
  skLoadingArray = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4];
  tableNameText = '';
  @Input('formObject') formObject;
  @Input('formID') formID;
  @Input('connectionId') connectionId;
  @Input('systemName') systemName;
  @Input('updateData') updateData;
  @Output('backHome') backHome = new EventEmitter();
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
  whereCluase = null;

  constructor(private modalService: BsModalService,
              private loading: NgxUiLoaderService,
              private cd: ChangeDetectorRef,
              private systemIntegrationService: SystemIntegrationService,
              private activatedRoutes: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoutes.queryParams.subscribe(params => {
      this.orgID = params.oid;
    });
    this.onFindTables();
    this.onFillEditContent();
  }

  onFillEditContent() {
    const queryOption = [];
    for (const option of this.formObject.request_form) {
      queryOption.push({name: 'Form.' + option.controllabel, value: option.controlId});
    }
    for (const data of this.updateData) {
      if (data.field === 'table') {
        (async () => {
          this.tableNameText = data.value_1;
          await this.onSelectTable(data.value_1);
        })();
      }
      if (data.field === 'select') {
        this.sqlSelectField = JSON.parse(data.value_1);
      }
      if (data.field === 'where') {
        this.whereCluase = JSON.parse(data.value_1);
      }
    }
  }

  onFindTables() {
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
    return new Promise((resolve, rejects) => {
      this.tableName = tableName;
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
            this.tableColumnsList = res.response;
            this.tableColumnsListKey = res.columns[0];
            this.onCreateSqlBuilder();
            resolve(true);
          }
        }, error => {
          this.skLoading.two = false;
          // this.loading.stop();
          this.tableColumnsList = [];
          this.isOpen = true;
          this.alertMsg = 'Unable to get columns';
          this.alertType = 'danger';
          rejects(true);
        });

    });
  }

  onCreateSqlBuilder() {
    const queryOption = [];
    for (const option of this.formObject.request_form) {
      queryOption.push({name: 'Form.' + option.controllabel, value: option.controlId});
    }
    const fieldsData = {};
    for (const column of this.tableColumnsList) {
      fieldsData[column[this.tableColumnsListKey]] = {
        name: column[this.tableColumnsListKey],
        type: 'category',
        operators: ['=', '<=', '>'],
        options: queryOption
      };
    }
    const dataRules = this.whereCluase.rules;
    const conditionType = this.whereCluase.condition;
    this.query = {
      condition: conditionType,
      rules: dataRules
    };

    this.config = {
      fields: fieldsData
    };
  }

  onSelectField(field) {
    const sqlSelectField = [...this.sqlSelectField];
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

  onUpdateSqlBuilder() {
    const payload = [
      {field: 'select', value_1: JSON.stringify(this.sqlSelectField), system_name: this.systemName},
      {field: 'where', value_1: JSON.stringify(this.query), system_name: this.systemName},
      {field: 'table', value_1: this.tableName, system_name: this.systemName}
    ];
    this.loading.start();
    this.systemIntegrationService.updateQueryBuilder(this.constructor.name, moduleName.systemIntegrationModule, payload, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
      this.loading.stop();
      if (res.status === 201) {
        this.sqlPageStep = 2;
        this.isOpen = true;
        this.alertMsg = 'Record Updated';
        this.alertType = 'info';
        this.backHome.emit(true);
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
