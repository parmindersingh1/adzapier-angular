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
import {moduleName} from '../../../../../_constant/module-name.constant';
import {ActivatedRoute} from '@angular/router';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-mailchimp-query-builder',
  templateUrl: './mailchimp-query-builder.component.html',
  styleUrls: ['./mailchimp-query-builder.component.scss']
})
export class MailchimpQueryBuilderComponent implements OnInit, OnChanges {
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
  constructor(private cd: ChangeDetectorRef,
              private integrationService: SystemIntegrationService,
              private activatedRoutes: ActivatedRoute,
              private loading: NgxUiLoaderService
              ) { }

  ngOnInit(): void {
    this.activatedRoutes.queryParams.subscribe(params => {
      this.orgID =  params.oid;
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    this.formObject = changes.formObject.currentValue;
    this.cd.detectChanges();
  }
  onSubmit() {
    const payload = [
      {field: 'email', value_1: this.emailAddress,  system_name: this.systemName},
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
    this.backHome.emit(true)
  }
}
