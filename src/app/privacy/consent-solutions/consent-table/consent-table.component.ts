import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {OrganizationService} from '../../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {moduleName} from '../../../_constant/module-name.constant';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ConsentSolutionsService} from '../../../_services/consent-solutions.service';
import {BsDatepickerConfig, DatepickerDateCustomClasses} from 'ngx-bootstrap/datepicker';
import { FormBuilder,FormArray, FormGroup, Validators } from '@angular/forms';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-consent-solutions',
  templateUrl: './consent-table.component.html',
  styleUrls: ['./consent-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsentTableComponent implements OnInit {
  currentManagedOrgID: any;
  currrentManagedPropID: any;
  consentRecordList = [];
  consentRecordCount = 0;
  private firstone: number;
  eventRows;
  tLoading = true;
  consentData:any;
  submitted = false;
  modalRef: BsModalRef;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  AddConsentForm:FormGroup
  pagelimit;
  dismissible = true;
  planDetails: any;
  showFilters = false;
  searchDecouncer$: Subject<any> = new Subject();
  public inputSearch = '';

  emailDebouncer$: Subject<any> = new Subject();
  public emailSearch = '';

  firstnameDebouncer$: Subject<any> = new Subject();
  public firstnameSearch = '';

  lastnameDebouncer$: Subject<any> = new Subject();
  public lastnameSearch = '';

  IpAddressDebouncer$: Subject<any> = new Subject();
  public IpAddressSearch = '';

  source$: Subject<any> = new Subject();
  public sourceSearch = '';


  bsConfig: Partial<BsDatepickerConfig>;
  dateCustomClasses: DatepickerDateCustomClasses[];
  searchbydaterange: any = '';
  date1: Date = new Date('yyyy-mm-dd');
  ranges: any = [
    {
      value: [new Date(), new Date()],
      label: 'Today'
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1))],
      label: 'Yesterday'
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date()
      ],
      label: 'Last 7 Days'
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date()
      ],
      label: 'Last 30 Days'
    },
    {
      value: [new Date(new Date().setDate(new Date().getMonth())), new Date()],
      label: 'This Month'
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      ],
      label: 'Last Month'
    },
    {
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      label: 'This Year'
    },
    {
      value: [
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        new Date()
      ],
      label: 'Last Year'
    },
  ];


  constructor(private orgservice: OrganizationService,
              private consentSolutionService: ConsentSolutionsService,
              private loading: NgxUiLoaderService,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onSetUpDebounce();
    this.initForm();
  }

  onSetUpDebounce() {
    this.setupSearchDebouncer();
    this.setupEmailDebouncer();
    this.setupFirstNameDebouncer();
    this.setupLastNameDebouncer();
    this.setupIpAddressDebouncer();
    this.setupSourceDebouncer();

  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
  }

  initForm() {
    this.AddConsentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required,Validators.pattern],
      dataSource: ['', Validators.required],
      country: ['', Validators.required],
      ownerID: [''],
      ipAddress: ['', Validators.required],
      newsLetter:[''],
      privacyPolicy:[''],
      term_of_service:[''],
      verified:[''],
      proofs:this.formBuilder.array([this.initItemRows()]),
      legalNotices:this.formBuilder.array([this.initLegalRows()]),

    });
  }

  get formArr(){
    return this.AddConsentForm.get('proofs') as FormArray;
  }

  initItemRows(){
    return this.formBuilder.group({
      content:[''],
      form:[''],
    });
  }

  addNewRow(){
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index:number){
    this.formArr.removeAt(index);
  }

  get LegalArr(){
    return this.AddConsentForm.get('legalNotices') as FormArray;
  }

  initLegalRows(){
    return this.formBuilder.group({
      identifier:[''],
      version:[Number],
      content:[''],
    })
  }

  addNewLegalRow(){
    this.LegalArr.push(this.initLegalRows());
  }

  deleteLegalRow(index:number){
    this.LegalArr.removeAt(index);

  }
 

  onAddconsentRecord(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.AddConsentForm.invalid) {
      return;
    }
    const payloads = {
      owner_id: this.AddConsentForm.value.ownerID,
      email: this.AddConsentForm.value.email,
      first_name: this.AddConsentForm.value.firstName,
      last_name: this.AddConsentForm.value.lastName,
      verified: this.AddConsentForm.value.verified,
      // optout: this.consentData.optout,
      country: this.AddConsentForm.value.country,
      data_source: this.AddConsentForm.value.dataSource,
      ip_address: this.AddConsentForm.value.ipAddress,
      preferences:{newsletter:this.AddConsentForm.value.newsLetter,
      privacy_policy:this.AddConsentForm.value.privacyPolicy,
      term_of_service:this.AddConsentForm.value.term_of_service},
      proofs:this.AddConsentForm.value.proofs,
      legal_notices:this.AddConsentForm.value.legalNotices,
    };
    this.loading.start();
    this.consentSolutionService.PutConsentRecord(this.constructor.name, moduleName.consentSolutionModule, payloads, this.currrentManagedPropID)
      .subscribe((res: any) => {
        this.loading.stop();
        if (res) {
          this.isOpen = true;
          this.alertMsg = res.message;
          this.alertType = 'success';
          this.modalRef.hide();
        }
      }, err => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = err.message;
        this.alertType = 'danger';
      });
  }

  AddConsentRecord(addrecord) {
    this.modalRef = this.modalService.show(addrecord, Object.assign({}, { class: 'gray modal-lg' })
    );
    this.AddConsentForm.patchValue({
      firstName:'',
      lastName:'',
      email:'',
      dataSource:'',
      country:'',
      ownerID:'',
      ipAddress:'',
      newsLetter:false,
      privacyPolicy:false,
      term_of_service:false,
      verified:false,
      proofs:[{
        content:'',
        form:''
      }],
      legalNotices:[{
        identifier:'',
        version:'',
        contents:'',

      }]
    })
  }

  onCancelClick(){
    this.submitted = false;
    this.AddConsentForm.reset();
    
  }

  get f() {
    return this.AddConsentForm.controls;
  }

  onGetConsentSolutionData(event) {
    this.tLoading = true;
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
    this.pagelimit = '?limit=' + this.eventRows + '&page=' + this.firstone;
    this.onGetConsentRecord();
  }

  onGetLegalSolutionData(event) {
    this.tLoading = true;
    this.eventRows = event.rows;
    if (event.first === 0) {
      this.firstone = 1;
    } else {
      this.firstone = (event.first / event.rows) + 1;
    }
  }

  onGetConsentRecord() {
    this.loading.start();
    this.pagelimit = {
      limit: this.eventRows,
      page: this.firstone,
      search: this.inputSearch,
      email: this.emailSearch,
      first_name: this.firstnameSearch,
      last_name: this.lastnameSearch,
      ip_address: this.IpAddressSearch,
      data_source: this.sourceSearch
    };

    this.consentSolutionService.getConsentRecord(this.constructor.name, moduleName.consentSolutionModule, this.pagelimit, this.currrentManagedPropID)
      .subscribe((res: any) => {
        this.loading.stop();
        const result: any = res;
        if (result.status === 200) {
          this.consentRecordList = result.response;
          this.consentRecordCount = result.count;
        }
      }, error => {
        this.loading.stop();
      });
  }

  async onNavigateToDetails(consentRecord) {
    await this.consentSolutionService.onPushConsentData(consentRecord);
    await this.router.navigateByUrl('/consent-solutions/consent-records/details/' + consentRecord.id);
  }

  public onSearchInputChange(e): void {
    this.inputSearch = e.target.value;
    this.searchDecouncer$.next(e.target.value);
  }


  private setupSearchDebouncer(): void {
    this.searchDecouncer$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.onGetConsentRecord();
    });
  }

// Email
  public onEmailInputChange(e): void {
    this.emailSearch = e.target.value;
    this.emailDebouncer$.next(e.target.value);
  }

  private setupEmailDebouncer(): void {
    this.emailDebouncer$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.onGetConsentRecord();
    });
  }

  //firstname
  public onFirstNameInputChange(e): void {
    this.firstnameSearch = e.target.value;
    this.firstnameDebouncer$.next(e.target.value);
  }

  private setupFirstNameDebouncer(): void {
    this.firstnameDebouncer$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.onGetConsentRecord();
    });
  }

  //lastname
  public onLastNameInputChange(e): void {
    this.lastnameSearch = e.target.value;
    this.lastnameDebouncer$.next(e.target.value);
  }

  private setupLastNameDebouncer(): void {
    this.lastnameDebouncer$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.onGetConsentRecord();
    });
  }

  //IPAddress
  public onIpAddressInputChange(e): void {
    this.IpAddressSearch = e.target.value;
    this.IpAddressDebouncer$.next(e.target.value);
  }

  private setupIpAddressDebouncer(): void {
    this.IpAddressDebouncer$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.onGetConsentRecord();
    });
  }

  //source
  public onSourceInputChange(e): void {
    this.sourceSearch = e.target.value;
    this.source$.next(e.target.value);
  }

  private setupSourceDebouncer(): void {
    this.source$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      this.onGetConsentRecord();
    });
  }


  onDateSelection() {
    if (this.searchbydaterange.length > 0) {
      const startDate = this.searchbydaterange[0].toJSON().split('T')[0];
      const endDate = this.searchbydaterange[1].toJSON().split('T')[0];
      this.loading.start();
      this.pagelimit = {
        limit: this.eventRows,
        page: this.firstone,
        search: this.inputSearch,
        email: this.emailSearch,
        first_name: this.firstnameSearch,
        last_name: this.lastnameSearch,
        ip_address: this.IpAddressSearch,
        data_source: this.sourceSearch,
        start_date: startDate,
        end_date: endDate
      };
      this.consentSolutionService.getConsentRecord(this.constructor.name, moduleName.consentSolutionModule, this.pagelimit, this.currrentManagedPropID)
        .subscribe((res: any) => {
          this.loading.stop();
          const result: any = res;
          if (result.status === 200) {
            this.consentRecordList = result.response;
            this.consentRecordCount = result.count;
          }
        }, error => {
          this.loading.stop();
        });
    }
  }

}
