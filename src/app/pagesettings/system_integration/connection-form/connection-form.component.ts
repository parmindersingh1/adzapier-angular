import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SystemIntegrationService} from '../../../_services/system_integration.service';
import {moduleName} from '../../../_constant/module-name.constant';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-connection-form',
  templateUrl: './connection-form.component.html',
  styleUrls: ['./connection-form.component.scss']
})
export class ConnectionFormComponent implements OnInit {
  connectionForm: FormGroup;
  submitted = false;
  @Input('systemID') systemID;
  @Output('refreshConnection') refreshConnection = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
              private systemIntegrationService: SystemIntegrationService,
              private loading: NgxUiLoaderService
              ) { }

  ngOnInit(): void {
    this.connectionForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  get f() { return this.connectionForm.controls; }
  onSubmit() {
    this.submitted = true;

    if (this.connectionForm.invalid) {
      return;
    }

    const payload = {
      name: this.connectionForm.value.name,
      description: this.connectionForm.value.description,
      system_id: this.systemID
    };
    this.loading.start();
    this.systemIntegrationService.SaveConnectionIntegration(this.constructor.name,
      moduleName.systemIntegrationModule, payload)
      .subscribe(res => {
        this.loading.stop();
        this.refreshConnection.emit(true);
      });


  }
}
