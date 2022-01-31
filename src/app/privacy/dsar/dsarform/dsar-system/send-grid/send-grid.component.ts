import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {SystemIntegrationService} from '../../../../../_services/system_integration.service';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../../../_constant/module-name.constant';

@Component({
  selector: 'app-send-grid',
  templateUrl: './send-grid.component.html',
  styleUrls: ['./send-grid.component.scss']
})
export class SendGridComponent implements OnInit {
  sendGrid = ['address_line_1',
    'address_line_2',
    'alternate_emails',
    'city',
    'country',
    'created_at',
    'email',
    'facebook',
    'first_name',
    'id',
    'last_name',
    'line',
    'list_ids',
    'phone_number',
    'postal_code',
    'segment_ids',
    'state_province_region',
    'unique_name',
    'updated_at'
  ];
  @Input('formObject') formObject;
  @Input('formID') formID;
  @Input('connectionId') connectionId;
  @Input('systemName') systemName;
  @Output('backHome') backHome = new EventEmitter();
  emailAddress = '';
  pageStep = 1;
  orgID = null;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  columnsList = [];
  isUpdate = false;

  constructor(private cd: ChangeDetectorRef,
              private integrationService: SystemIntegrationService,
              private activatedRoutes: ActivatedRoute,
              private loading: NgxUiLoaderService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoutes.queryParams.subscribe(params => {
      this.orgID = params.oid;
    });
    this.onGetSavedData();
  }

  onGetSavedData() {
    this.integrationService.GetQueryBuilderData(this.constructor.name,
      moduleName.systemIntegrationModule, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
      if (res.status === 200) {
        if (res.response.length > 0) {
          this.isUpdate = true;
          this.onSetSaveValue(res.response);
        }
      }
    });
  }

  onSetSaveValue(data){
    for (const obj of data) {
      if (obj.field === 'email') {
        this.emailAddress = obj.value_1;
      }
      if (obj.field === 'columns') {
        this.columnsList = JSON.parse(obj.value_1);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formObject = changes.formObject.currentValue;
    this.cd.detectChanges();
  }
  onUpdate() {
    const payload = [
      {field: 'columns', system_name: this.systemName, value_1: JSON.stringify(this.columnsList)},
      {field: 'email', value_1: this.emailAddress, system_name: this.systemName},
    ];
    this.loading.start();
    this.integrationService.updateQueryBuilder(this.constructor.name, moduleName.systemIntegrationModule, payload, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
      this.loading.stop();
      if (res.status === 201) {
        this.isOpen = true;
        this.alertMsg = 'Record Update';
        this.alertType = 'info';
        this.pageStep = 2;
      }
    }, error => {
      this.loading.stop();
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }

  onSubmit() {
    if (!this.emailAddress || this.columnsList.length === 0) {
      return false;
    }
    const payload = [
      {field: 'columns', system_name: this.systemName, value_1: JSON.stringify(this.columnsList)},
      {field: 'email', value_1: this.emailAddress, system_name: this.systemName},
    ];
    if (this.isUpdate) {
      this.onUpdate();
      return false;
    }
    this.loading.start();
    this.integrationService.saveQueryBuilder(this.constructor.name, moduleName.systemIntegrationModule, payload, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
      this.loading.stop();
      if (res.status === 201) {
        this.isOpen = true;
        this.alertMsg = 'Record Saved';
        this.alertType = 'info';
        this.pageStep = 2;
      }
    }, error => {
      this.loading.stop();
      this.isOpen = true;
      this.alertMsg = error;
      this.alertType = 'danger';
    });
  }

  onConnectionListPage() {
    this.backHome.emit(true);
  }
  onSelectColumn(column){
    const  columnsList = [...this.columnsList];
    if (!columnsList.includes(column)) {
      columnsList.push(column);
    } else {
      const index = this.columnsList.indexOf(column);
      if (index > -1) {
        columnsList.splice(index, 1);
      }
    }
    this.columnsList = columnsList;
  }
}
