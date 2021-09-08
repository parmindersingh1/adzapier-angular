import { Component, OnInit } from '@angular/core';
import {moduleName} from '../../../../_constant/module-name.constant';
import {SystemIntegrationService} from '../../../../_services/system_integration.service';

@Component({
  selector: 'app-dsar-system',
  templateUrl: './dsar-system.component.html',
  styleUrls: ['./dsar-system.component.scss']
})
export class DsarSystemComponent implements OnInit {
  systemList = [];
  currentSystemType = '';
  systemID = '';
  constructor(private systemIntegrationService: SystemIntegrationService) { }
  ngOnInit(): void {
    this.onGetSystemList();
  }
  onGetSystemList() {
    this.systemIntegrationService.GetSystemList(this.constructor.name, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.systemList = res.response;
      });
  }
  onSelectSystem(obj, step) {

  }
}
