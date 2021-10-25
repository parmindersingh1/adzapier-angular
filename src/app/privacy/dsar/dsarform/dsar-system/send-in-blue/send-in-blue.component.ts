import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {SystemIntegrationService} from '../../../../../_services/system_integration.service';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../../../_constant/module-name.constant';

@Component({
  selector: 'app-send-in-blue',
  templateUrl: './send-in-blue.component.html',
  styleUrls: ['./send-in-blue.component.scss']
})
export class SendInBlueComponent implements OnInit {
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
  isUpdate = false;

  constructor(private cd: ChangeDetectorRef,
              private integrationService: SystemIntegrationService,
              private activatedRoutes: ActivatedRoute,
              private loading: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.activatedRoutes.queryParams.subscribe(params => {
      this.orgID =  params.oid;
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
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formObject = changes.formObject.currentValue;
    this.cd.detectChanges();
  }

  onUpdate() {
    const payload = [
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
    const payload = [
      {field: 'email', value_1: this.emailAddress,  system_name: this.systemName},
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
    this.backHome.emit(true)
  }
}
