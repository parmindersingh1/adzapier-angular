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
export class HttpQueryBuilderComponent implements OnInit, OnChanges, AfterViewInit {
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
      path: ['', Validators.required],
      queryParams: this.formBuilder.array([])
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.formObject = changes.formObject.currentValue;
    this.cd.detectChanges();
  }
  ngAfterViewInit() {
    this.addSkills();
  }
  get f() { return this.httpQueryBuilderForm.controls; }

  get skills(): FormArray {
    return this.httpQueryBuilderForm.get('queryParams') as FormArray;
  }

  newSkill(): FormGroup {
    return this.formBuilder.group({
      field: ['', Validators.required],
      value_1: ['', Validators.required],
      system_name: [this.systemName]
    });
  }

  addSkills() {
    this.skills.push(this.newSkill());
  }

  removeSkill(i:number) {
    this.skills.removeAt(i);
  }





  onSubmit() {
    this.submitted = true;
    console.log('this.httpQueryBuilderForm', this.httpQueryBuilderForm)
    // stop here if form is invalid
    if (this.httpQueryBuilderForm.invalid) {
      return;
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
  onConnectionListPage() {
    this.backHome.emit(true)
  }
}
