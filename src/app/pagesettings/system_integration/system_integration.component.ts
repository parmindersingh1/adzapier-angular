import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {LazyLoadEvent} from 'primeng/api';
import {SystemIntegrationService} from '../../_services/system_integration.service';
import {moduleName} from '../../_constant/module-name.constant';


@Component({
  templateUrl: './system_integration.component.html',
  styleUrls: ['./system_integration.component.scss'],
  selector: 'app-system-integration'
})

export class SystemIntegrationComponent implements OnInit {
  modalRef: BsModalRef;
  cols: any[];
  virtualCars: [];
  cars = [];
  systemList = [];
  connectionList = [];
  currentSystem = {
    id: null,
    name: null
  };
  step = 1;
  eventRows;
  firstone;
  constructor(private modalService: BsModalService,
              private systemIntegrationService: SystemIntegrationService,
  ) {
  }
  ngOnInit() {
    this.cols = [
      {field: 'id', header: 'ID'},
      {field: 'year', header: 'Year'},
      {field: 'brand', header: 'Brand'},
      {field: 'color', header: 'Color'}
    ];
    this.onGetSystemList();
    this.onGetConnectionList();
  }

  onGetSystemList() {
    this.systemIntegrationService.GetSystemList(this.constructor.name, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.systemList = res.response;
      })
  }

  onGetConnectionList() {
    this.systemIntegrationService.GetConnectionListByCompany(this.constructor.name, moduleName.systemIntegrationModule)
      .subscribe((res: any) => {
        this.connectionList = res.response;
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

  onSelectSystem(obj, step) {
    this.currentSystem = {
      id: obj.id,
      name: obj.name
    };
    this.step = step;
  }
}
