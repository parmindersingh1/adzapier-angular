import {ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {moduleName} from '../../../../_constant/module-name.constant';
import {SystemIntegrationService} from '../../../../_services/system_integration.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {type} from 'os';

@Component({
  selector: 'app-dsar-connection-list',
  templateUrl: './dsar-connection-list.component.html',
  styleUrls: ['./dsar-connection-list.component.scss']
})
export class DsarConnectionListComponent implements OnInit {
  @Input('formID') formID;
  @Input('requestID') requestID;
  type = 1;
  @ViewChild('template', {static: false}) template;
  isLoading = true;
  connectionList: any = null;
  connectionDetails: any = {
    response: [],
    cols: [],
    connectionName: ''
  };
  connectionDetailsKeys = [];
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
  }
  onShowSqlData(type, data) {
    this.currentStep = type;
    this.type = 2;
    this.connectionDetails = data;
    this.cd.detectChanges();
  }

  onShowRestAPIData(type, data) {
    this.currentStep = type;
    this.type = 2;
    if (data.responsePath) {
      this.connectionDetails = data.response[data.responsePath];
    } else {
      this.connectionDetails = data.response;
    }
    this.connectionDetailsKeys = Object.keys(this.connectionDetails[0]);
    this.cd.detectChanges();
  }
openModal(template: TemplateRef<any>, ) {
  this.modalRef = this.modalService.show(template);
}
  onFindTotalCount(res){
    let count = '0';
    if (Array.isArray(res.response)) {
      count = String(res.response.length);
    }
   else if (res.response !== null) {
      count = '1';
    }
    return count;
  }
  onGoBack(e) {
    this.type = 1;
  }

  onFindTotalActiveCampaginCount(res){
    let count = '0';
    if (Array.isArray(res?.response?.contacts)) {
      count = String(res?.response?.contacts.length);
    }
    return count;
  }

  onFindTotalSendInBlueCount(res){
    let count = '0';
    if (res?.response?.email) {
      count = '1';
    }
    return count;
  }

  onFindTotalMoosendCount(res){
    let count = '0';
    if (!res?.response?.Error) {
      count = '1';
    }
    return count;
  }
}
