import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  AfterViewInit,
  Output, EventEmitter
} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {moduleName} from '../../../../../_constant/module-name.constant';
import {SystemIntegrationService} from '../../../../../_services/system_integration.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-http-query-builder',
  templateUrl: './http-query-builder.component.html',
  styleUrls: ['./http-query-builder.component.scss']
})
export class HttpQueryBuilderComponent implements OnInit,  AfterViewInit {
  @Input('formObject') formObject;
  @Input('formID') formID;
  @Input('connectionId') connectionId;
  @Input('systemName') systemName;
  @Output('backHome') backHome = new EventEmitter();

  httpQueryBuilderForm: FormGroup;
  submitted = false;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  orgID = null;
  pageStep = 1;
  updateData = [];
  isUpdate = false;
  constructor(private formBuilder: FormBuilder,
              private cd: ChangeDetectorRef,
              private loading: NgxUiLoaderService,
              private activatedRouters: ActivatedRoute,
              private systemIntegrationService: SystemIntegrationService) { }

  ngOnInit(): void {
    this.activatedRouters.queryParams.subscribe(params => {
      this.orgID =  params.oid;
    });
    this.httpQueryBuilderForm = this.formBuilder.group({
      path: [''],
      queryParams: this.formBuilder.array([])
    });
    this.onGetSavedData();
  }

  onGetSavedData() {
    this.systemIntegrationService.GetQueryBuilderData(this.constructor.name,
      moduleName.systemIntegrationModule, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
      if (res.status === 200) {
        if (res.response.length > 0) {
          this.updateData = res.response;
          this.isUpdate = true;
          this.fillSavedData();
        } else {
          this.addSkills();
        }
      }
    });
  }
  fillSavedData (){
    // OID: "f1090f4a-a5e4-40f5-8d96-4038de69a999"
    // connection_id: "703c8def-a455-40f0-9a0d-5b720da43a81"
    // created_at: "2021-12-23T08:17:35.602756Z"
    // field: "path"
    // form_id: "d9d503d0-94ae-439f-8db7-9c95de7c10fa"
    // id: "2fd636e5-b861-4bb7-ab3e-9627b9f241ef"
    // system_name: "http"
    // updated_at: "2021-12-23T08:17:35.602756Z"
    // value_1: "response"
    for (const obj of this.updateData) {
      if (obj.field === 'path') {
        this.httpQueryBuilderForm.patchValue({
          path: obj.value_1
        });
      } else {
        this.skills.push(this.fillSaved(obj.field, obj.value_1, obj.value_2));
      }
    }
  }
  fillSaved(field, value_1, value_2): FormGroup {
    return this.formBuilder.group({
      field: ['queryParam'],
      value_1: [value_1, Validators.required],
      value_2: [value_2, Validators.required],
      system_name: [this.systemName]
    });
  }

  ngAfterViewInit() {
    // this.addSkills();
  }
  get f() { return this.httpQueryBuilderForm.controls; }

  get skills(): FormArray {
    return this.httpQueryBuilderForm.get('queryParams') as FormArray;
  }

  newSkill(): FormGroup {
    return this.formBuilder.group({
      field: ['queryParam'],
      value_1: ['', Validators.required],
      value_2: ['', Validators.required],
      system_name: [this.systemName]
    });
  }

  addSkills() {
    this.skills.push(this.newSkill());
  }

  removeSkill(i:number) {
    if (this.httpQueryBuilderForm.controls.queryParams['controls'].length === 1) {
      return
    }
    this.skills.removeAt(i);
  }





  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.httpQueryBuilderForm.invalid) {
      return;
    }
    if (this.isUpdate) {
      this.onUpdate();
      return false;
    }
    const payload = [...this.httpQueryBuilderForm.value.queryParams];
    payload.push({
      field: 'path',
      value_1: this.httpQueryBuilderForm.value.path,
      system_name: this.systemName
    });
    this.loading.start();
    this.systemIntegrationService.saveQueryBuilder(this.constructor.name, moduleName.systemIntegrationModule, payload, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
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
    })
  }
  onUpdate() {
    const payload = [...this.httpQueryBuilderForm.value.queryParams];
    payload.push({
      field: 'path',
      value_1: this.httpQueryBuilderForm.value.path,
      system_name: this.systemName
    });
    this.loading.start();
    this.systemIntegrationService.updateQueryBuilder(this.constructor.name, moduleName.systemIntegrationModule, payload, this.orgID, this.connectionId, this.formID).subscribe((res: any) => {
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

  onConnectionListPage() {
    this.backHome.emit(true)
  }
}
