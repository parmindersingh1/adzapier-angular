import {ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {moduleName} from '../../../../_constant/module-name.constant';
import {SystemIntegrationService} from '../../../../_services/system_integration.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dsar-connection-list',
  templateUrl: './dsar-connection-list.component.html',
  styleUrls: ['./dsar-connection-list.component.scss']
})
export class DsarConnectionListComponent implements OnInit {
  @Input('formID') formID;
  @Input('requestID') requestID;
  @ViewChild('template', {static: false}) template;
  isLoading = true;
  connectionList: any = null;
  sqlDetails: any = {
    response: [],
    cols: [],
    connectionName: ''
  };
  modalRef?: BsModalRef;
  currentStep = '';
  showDataonModal = '';

  constructor(private systemIntegrationService: SystemIntegrationService,
              private modalService: BsModalService,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onFetchConnectionsList();
  }
  onFetchConnectionsList() {
    this.isLoading = true;
    this.systemIntegrationService.GetIntegratedConnectionsList(this.formID, this.requestID, this.constructor.name, moduleName.dsarRequestModule).subscribe((res: any) => {
      if (res.status) {
        this.connectionList = res.response;
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }i
  onShowSqlData(type, data) {
    this.currentStep = type;
    this.sqlDetails = data;
    this.cd.detectChanges();

    if (type === 'restApi' || type === 'mailChimp' ) {

      if (this.currentStep === 'restApi') {
        this.showDataonModal = JSON.stringify(this.sqlDetails?.restApi);
      } else if ( this.currentStep === 'mailChimp') {
        this.showDataonModal = JSON.stringify(this.sqlDetails?.response);
      } else {
        this.showDataonModal = 'Something went Wrong';
      }
      this.openModal(this.template);
    }
  }
openModal(template: TemplateRef<any>, ) {
  this.modalRef = this.modalService.show(template);
}
}
