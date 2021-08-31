import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
  startDateCsv: any;
  endDateCsv: any
  @ViewChild('template', { static: true}) template: ElementRef;
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
  AddConsentForm:FormGroup;
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
  downloadStatus = {
    consents: false,
    legalNotices: false,
    Proofs: false,
    Preference: false
  };


  bsConfig: Partial<BsDatepickerConfig>;
  dateCustomClasses: DatepickerDateCustomClasses[];
  searchbydaterange: any = '';
  searchbydaterangeExport: any = '';
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
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0)
      ],
      label: 'Last 6 Months'
    },
  ];


  constructor(private orgservice: OrganizationService,
              private consentSolutionService: ConsentSolutionsService,
              private loading: NgxUiLoaderService,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService
  ) {
    this.dateCustomClasses = [
      { date: new Date(), classes: ['theme-dark-blue'] },
    ];
    this.searchbydaterange = [new Date(new Date().setDate(new Date().getDate() - 30)),new Date()]
    this.searchbydaterangeExport = [new Date(new Date().setDate(new Date().getDate() - 30)),new Date()]
  }

  ngOnInit() {
    this.onGetPropsAndOrgId();
    this.onSetUpDebounce();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue', showClearButton: true, returnFocusToInput: true,
      dateInputFormat: 'yyyy-mm-dd', adaptivePosition : true, showTodayButton:true, ranges: this.ranges  });
    this.initForm();
    this.startDateCsv = this.searchbydaterangeExport[0].toJSON().split('T')[0];
    this.endDateCsv = this.searchbydaterangeExport[1].toJSON().split('T')[0];
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
        this.currentManagedOrgID = response.organization_id || response.response.oid;
        this.currrentManagedPropID = response.property_id || response.response.id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id || orgDetails.response.oid;
        this.currrentManagedPropID = orgDetails.property_id || orgDetails.response.id;
      }
    });
  }

  initForm() {
    this.AddConsentForm = this.formBuilder.group({
      firstName: ['',],
      lastName: ['',],
      email: ['', [Validators.required,Validators.pattern]],
      dataSource: ['',],
      country: ['',],
      ownerID: ['',],
      ipAddress: ['',],
      AuthID:['',],
      // newsLetter:[''],
      // term_of_service:[''],
      // privacyPolicy:[''],
      preferences:this.formBuilder.array([]),
      verified:[''],
      proofs:this.formBuilder.array([]),
      legalNotices:this.formBuilder.array([]),

    });
  }

  get prefArr(){
    return this.AddConsentForm.get('preferences') as FormArray;
  }

  initPrefRows(){
    return this.formBuilder.group({
      preference:['',Validators.required],
      allow:[false],
    })
  }

  addNewPref(){
    this.prefArr.push(this.initPrefRows());
  }

  deletePref(index){
    this.prefArr.removeAt(index);
  }

  get formArr(){
    return this.AddConsentForm.get('proofs') as FormArray;
  }

  initItemRows(){
    return this.formBuilder.group({
      content:['',Validators.required],
      form:['',Validators.required],
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
      identifier:['',Validators.required],
      version:['',Number],
      content:['',Validators.required],
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
      // preferences:{newsletter:this.AddConsentForm.value.newsLetter,
      // privacy_policy:this.AddConsentForm.value.privacyPolicy,
      // term_of_service:this.AddConsentForm.value.term_of_service},
      preferences:this.AddConsentForm.value.preferences,
      proofs:this.AddConsentForm.value.proofs,
      legal_notices:this.AddConsentForm.value.legalNotices,
      auth_id:this.AddConsentForm.value.AuthID,
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
          this.onGetConsentRecord();

          const preferences: any = this.AddConsentForm.controls['preferences'];
          for (let i = preferences.length -1; i >= 0; i--) {
            preferences.removeAt(i);
          }


          const proofs: any = this.AddConsentForm.controls['proofs'];
          for (let i = proofs.length -1; i >= 0; i--) {
            proofs.removeAt(i);
          }

          const legalNotices: any = this.AddConsentForm.controls['legalNotices'];
          for (let i = legalNotices.length -1; i >= 0; i--) {
            legalNotices.removeAt(i);
          }
          this.submitted = false;
        }
      }, err => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = err.message;
        this.alertType = 'danger';
        this.onCancelClick();
      });
  }

  AddConsentRecord(addrecord) {
    this.modalRef = this.modalService.show(addrecord, Object.assign({}, { class: 'gray modal-lg' },{
      backdrop: true,
      ignoreBackdropClick: true
      })
    );
    this.AddConsentForm.patchValue({
      firstName:'',
      lastName:'',
      email:'',
      dataSource:'',
      country:'',
      ownerID:'',
      ipAddress:'',
      verified:false,
      AuthID:'',
      preferences:[{
        preference:'',
        allow:false,

      }],
      // newsLetter:false,
      // term_of_service:false,
      // privacyPolicy:false,

      proofs:[{
        content:'',
        form:''
      }],
      legalNotices:[{
        identifier:'',
        version:'',
        content:'',

      }]
    })
  }

  onCancelClick(){
    this.submitted = false;
    this.modalRef.hide();
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
    const startDate = this.searchbydaterange[0].toJSON().split('T')[0];
    const endDate = this.searchbydaterange[1].toJSON().split('T')[0];
    this.pagelimit = {
      limit: this.eventRows,
      page: this.firstone,
      search: this.inputSearch,
      email: this.emailSearch,
      first_name: this.firstnameSearch,
      last_name: this.lastnameSearch,
      ip_address: this.IpAddressSearch,
      data_source: this.sourceSearch !== 'both' ? this.sourceSearch : '',
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

  openModal(template: any) {
    this.modalRef = this.modalService.show(template, { animated: false,    keyboard: false, class: 'modal-lg'});
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

  onSelectDateRangeForCsv() {
    if (this.searchbydaterangeExport.length > 0) {
      this.startDateCsv = this.searchbydaterangeExport[0].toJSON().split('T')[0];
      this.endDateCsv = this.searchbydaterangeExport[1].toJSON().split('T')[0];
    }
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
        data_source: this.sourceSearch !== 'both' ? this.sourceSearch : '',
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

  generateConsentCsv() {
    const params = {
      start_date: this.startDateCsv,
      end_date: this.endDateCsv
    };
    this.downloadStatus.consents = true;
    this.consentSolutionService.exportConsentCSv(this.currrentManagedPropID, params).subscribe(
      response => {
        this.downloadStatus.consents = false;
        const fileName = 'Adzapier-consents~' + this.currrentManagedPropID + '~' + this.startDateCsv + '~' + this.endDateCsv + '.csv';
        this.downLoadFile(response, 'text/csv', fileName );
      }
      , error => {
        this.downloadStatus.consents = false;
      });
  }
  generateLegalNoticesCsv() {
    const params = {
      start_date: this.startDateCsv,
      end_date: this.endDateCsv
    };
    this.downloadStatus.legalNotices = true;
    this.consentSolutionService.exportConsentLegalNoticesCSv(this.currrentManagedPropID, params).subscribe(
      response => {
        this.downloadStatus.legalNotices = false;
        const fileName = 'Adzapier-consents-legal-notices~' + this.currrentManagedPropID + '~' + this.startDateCsv + '~' + this.endDateCsv + '.csv';
        this.downLoadFile(response, 'text/csv', fileName );
      }
      , error => {
        this.downloadStatus.legalNotices = false;
      });
  }

  generateProofsCsv() {
    const params = {
      start_date: this.startDateCsv,
      end_date: this.endDateCsv
    };
    this.downloadStatus.Proofs = true;
    this.consentSolutionService.exportConsentProofsCSv(this.currrentManagedPropID, params).subscribe(
      response => {
        this.downloadStatus.Proofs = false;
        const fileName = 'Adzapier-consents-proofs~' + this.currrentManagedPropID + '~' + this.startDateCsv + '~' + this.endDateCsv + '.csv';
        this.downLoadFile(response, 'text/csv', fileName );
      }
      , error => {
        this.downloadStatus.Proofs = false;
      });
  }

  generatePreferenceCsv() {
    const params = {
      start_date: this.startDateCsv,
      end_date: this.endDateCsv
    };
    this.downloadStatus.Preference = true;
    this.consentSolutionService.exportConsentPreferenceCSv(this.currrentManagedPropID, params).subscribe(
      response => {
        this.downloadStatus.Preference = false;
        const fileName = 'Adzapier-consents-preferences~' + this.currrentManagedPropID + '~' + this.startDateCsv + '~' + this.endDateCsv + '.csv';
        this.downLoadFile(response, 'text/csv', fileName );
      }
      , error => {
        this.downloadStatus.Preference = false;
      });
  }


  downLoadFile(data: any, type: string, fileName) {
    const blob = new Blob([data], { type});
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
  }
}
