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
import {SystemIntegrationService} from '../../../../../_services/system_integration.service';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../../../_constant/module-name.constant';

@Component({
  selector: 'app-hubspot-query-builder',
  templateUrl: './hubspot-query-builder.component.html',
  styleUrls: ['./hubspot-query-builder.component.scss']
})
export class HubspotQueryBuilderComponent implements OnInit, OnChanges {
  sendGrid = [
    'createdate',
    'email',
    'firstname',
    'hs_object_id',
    'lastmodifieddate',
    'lastname',
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
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formObject = changes.formObject.currentValue;
    this.cd.detectChanges();
  }

  onSubmit() {
    if (!this.emailAddress || this.columnsList.length === 0) {
      return false;
    }
    const payload = [
      {field: 'columns', system_name: this.systemName, value_1: JSON.stringify(this.columnsList)},
      {field: 'email', value_1: this.emailAddress, system_name: this.systemName},
    ];
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

  onSelectColumn(column) {
    const columnsList = [...this.columnsList];
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
