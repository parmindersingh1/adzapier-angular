import { Component, OnInit, AfterViewChecked, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OrganizationService, UserService } from 'src/app/_services';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CompanyService } from 'src/app/company.service';
import { TablePaginationConfig } from 'src/app/_models/tablepaginationconfig';
import { Orglist } from 'src/app/_models/org';
import { moduleName } from 'src/app/_constant/module-name.constant';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuickmenuService } from 'src/app/_services/quickmenu.service';
import { QuickStart } from 'src/app/_models/quickstart';


@Component({
  selector: 'app-orgpage',
  templateUrl: './orgpage.component.html',
  styleUrls: ['./orgpage.component.scss']
})


export class OrgpageComponent implements OnInit,AfterViewInit,OnDestroy {
  organisationPropertyForm: FormGroup;
  editOrganisationForm: FormGroup;
  submitted: boolean;
  orgList: any = [];
  orgDetails: any = [];
  closeResult: any;
  isEditable: boolean;
  selectedOrg: any;
  selectedImage: File;
  propertyList: any;
  btnText: string = 'Show';
  editPropertyrow: boolean = false;
  propertyname: any;
  website: any;
  logourl: any;
  organizationname: any;
  taxidnumber: any;
  addressone: any;
  addresstwo: any;
  cityname: any;
  statename: any;
  zipcodenum: any;
  myContext;
  showOrgDetails: boolean = false;
  isEditProperty: boolean;
  p: number = 1;
  pageSize: any = 5;
  totalCount: any;
  paginationConfig: TablePaginationConfig;
  selectedOrganization: any = [];
  searchText = '';
  ascNumberSort: any;

  isControlDisabled: boolean;
  alertMsg: any;
  alertType: any;
  dismissible = true;
  isOpen = false;
  email: any;
  phone: any;
  companyID: any;
  currentUser: any;
  queryOID;
  queryPID;
  isorgqsmenu:any;
  isbtnClickedbyUser:boolean;
  subscription:Subscription;
  guidancetext:string = "Add your organization"
  private unsubscribeAfterUserAction$: Subject<any> = new Subject<any>();
  quickDivID;
  isquickstartmenu:any;
  actuallinkstatus:boolean;
  text = "Add your organization..."
  isRevistedLink:boolean;
  currentLinkID:any;
  highlightbtn:boolean = false;
  iswindowclicked;
  constructor(private formBuilder: FormBuilder,
              private orgservice: OrganizationService,
              private modalService: NgbModal, private sanitizer: DomSanitizer,
              private userService: UserService,
              private companyService: CompanyService,
              private router: Router,
              private loading: NgxUiLoaderService,
              private activatedRoute: ActivatedRoute,
              private quickmenuService: QuickmenuService,
              private cdRef: ChangeDetectorRef
  ) {
    this.paginationConfig = { itemsPerPage: this.pageSize, currentPage: this.p, totalItems: this.totalCount };
   }

  ngOnInit() {
    this.showQuickStartTooltip();    
    this.userService.isRevisitedQSMenuLink.subscribe((status) => { this.isRevistedLink = status.reclickqslink; this.currentLinkID = status.quickstartid; });
    
    this.isEditable = false;
    this.isEditProperty = false;
    const urlRegex = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    const zipRegex = '^[0-9]{5,20}$'; // '^[0-9]*$'; //'^[0-9]{6}(?:-[0-9]{4})?$';
    const strRegx = '^[a-zA-Z \-\']+';
    const alphaNumeric = '^(?![0-9]*$)[a-zA-Z0-9 ]+$';
    const phoneNumRegx = '^[0-9]*$'; // '^-?(0|[1-9]\d*)?$';
    this.organisationPropertyForm = this.formBuilder.group({
      propertyname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      website: ['', [Validators.required, Validators.pattern(urlRegex)]],
      logourl: ['']
    });
    this.editOrganisationForm = this.formBuilder.group({
      organizationname: ['', [Validators.required, Validators.pattern(alphaNumeric)]],
      taxidnumber: [''],
      addressone: ['', [Validators.required]],
      addresstwo: [''],
      cityname: ['', [Validators.required, Validators.pattern(strRegx)]],
      statename: ['', [Validators.required, Validators.pattern(strRegx)]],
      zipcodenum: ['', [Validators.required, Validators.pattern(zipRegex)]],
      email: ['', [Validators.required, Validators.pattern]],
      phone: ['', [Validators.pattern(phoneNumRegx)]]
    });
    this.loadOrganizationList();
    this.getLoggedInUserDetails();
    this.activatedRoute.queryParamMap
      .subscribe(params => {
        this.queryOID = params.get('oid');
        this.queryPID = params.get('pid');
      });
  }
  get orgProp() { return this.organisationPropertyForm.controls; }
  get editOrg() { return this.editOrganisationForm.controls; }


  getLoggedInUserDetails() {
    this.userService.getLoggedInUserDetails(this.constructor.name, moduleName.headerModule).subscribe((data) => {
      this.currentUser = data;
      this.companyID = this.currentUser.response.cID;
    },error => {
      this.alertMsg = JSON.stringify(error);
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  uploadFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.organisationPropertyForm.get('logo').setValue(file);
    }
  }

  loadOrganizationList() {
    // this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.loading.start();
    this.orgservice.orglist(pagelimit).subscribe((data: Orglist) => {
      this.loading.stop();
      const key = 'response';
      this.orgList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.orgList;
    }, (error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });

    // this.orgservice.orglist().subscribe((data) => {
    //   const key = 'response';
    //   this.orgList = data[key];
    //   this.paginationConfig.totalItems = data.count;
    // });

  }

  searchOrganization(searchTerm){
   this.orgservice.searchOragnization(this.companyID,searchTerm).subscribe((data) => {
     this.orgList = data.response;
   })
  }

  clearSearchfield(){
    this.searchText = '';
    this.loadOrganizationList();
  }

  loadOrganizationDetails(org) {
    this.orgDetails = [];
    this.showOrgDetails = !this.showOrgDetails;
    this.orgservice.viewOrganizationDetails(org.orgid).subscribe((data: any) => {
      const key = 'response';
      this.orgDetails.push(data[key]);
    }, (error) => {
      this.loading.stop();
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  updateOrganisationData() {
    this.submitted = true;
    if (this.editOrganisationForm.invalid) {
      return false;
    } else {
      const addObj = {
        orgname: this.capitalizeFirstLetter(this.editOrganisationForm.value.organizationname),
        taxID: this.editOrganisationForm.value.taxidnumber,
        address1: this.editOrganisationForm.value.addressone,
        address2: this.editOrganisationForm.value.addresstwo,
        city: this.editOrganisationForm.value.cityname,
        state: this.editOrganisationForm.value.statename,
        zipcode: this.editOrganisationForm.value.zipcodenum,
        email: this.editOrganisationForm.value.email.toLowerCase(),
        phone: this.editOrganisationForm.value.phone
      };
      this.loading.start();
      this.orgservice.addOrganization(addObj).subscribe((res) => {
        this.loading.stop();
        if (res) {
          this.orgservice.emitUpdatedOrganization.emit(res);
          this.orgservice.setCurrentOrgWithProperty(res);
          // this.orgservice.changeCurrentSelectedProperty(res);
          this.viewOrganization(res.response.id);
          //  alert('Organization Added successfully!');
          this.alertMsg = 'Organization Added successfully!';
          this.isOpen = true;
          this.alertType = 'success';
          this.orgservice.isOrganizationUpdated.next(true);
          this.onResetEditOrganization();
          this.orgDetails = [];
          this.showOrgDetails = false;
          this.loadOrganizationList();
          this.isEditable = false;
        }
      }, (error) => {
        this.loading.stop();
        this.onResetEditOrganization();
        this.submitted = false;
        this.alertMsg = JSON.stringify(error);
        this.isOpen = true;
        this.alertType = 'danger';
      });

    }

  }

  open(content, data) {
    this.propertyname = '';
    this.website = '';
    this.logourl = '';
    this.selectedOrg = data;
    this.isEditProperty = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getPropertyList(id): any {
    // this.isOpen = !this.isOpen;
    this.orgservice.getPropertyList(id).subscribe((data) => {
      this.orgservice.emitUpdatedOrgList.emit(data.response);
      if (!data.response) {
        this.alertMsg = 'Adding property is mandatory. Add Property first!';
        this.isOpen = true;
        this.alertType = 'info';
      }

      return this.propertyList = data.response;
    }, (error) => {
      this.alertMsg = error;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  transform(imgData) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgData);
  }

  editModalPopup(content, data) {
    this.isEditProperty = true;
    // this.selectedOrg = data;
    this.propertyname = data.propname;
    this.website = data.website;
    this.logourl = data.logo_url;
    this.myContext = { oid: data.oid, pid: data.pid };

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.organisationPropertyForm.reset();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.organisationPropertyForm.reset();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  organizationModalPopup(content, data) {
    if (this.quickDivID !== undefined || this.quickDivID !== "") {
      let quickLinkObj = {
        linkid: this.quickDivID,
        indexid: 1,
        isactualbtnclicked: true,
        islinkclicked: true
      };

      this.quickmenuService.onClickEmitQSLinkobj.next(quickLinkObj);
      this.quickmenuService.updateQuerymenulist(quickLinkObj);
    }
   // this.quickDivID = "";
   
    if (data !== '') {
      this.myContext = { oid: data.id };
      this.organizationname = data.orgname;
      this.taxidnumber = data.taxID;
      this.addressone = data.address1;
      this.addresstwo = data.address2;
      this.cityname = data.city;
      this.statename = data.state;
      this.zipcodenum = data.zipcode;
      this.email = data.email;
      this.phone = data.phone;
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.editOrganisationForm.reset();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.editOrganisationForm.reset();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.organizationname = '';
      this.taxidnumber = '';
      this.addressone = '';
      this.addresstwo = '';
      this.cityname = '';
      this.statename = '';
      this.zipcodenum = '';
      this.email = '';
      this.phone = '';
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.editOrganisationForm.reset();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.editOrganisationForm.reset();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  }

  onClickOrgbtn(){
    this.isorgqsmenu = !this.isorgqsmenu;
  }

  onResetEditOrganization() {
    this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true,urlchanged:false});
    this.quickDivID = "";
    this.submitted = false;
    this.editOrganisationForm.reset();
    this.modalService.dismissAll('Data Saved!');
  }

  clickToManage(propertyID) {
    this.router.navigate(['propertydashboard/', propertyID]);
  }

  pageChangeEvent(event) {
    this.paginationConfig.currentPage = event;
    const pagelimit = '?limit=' + this.paginationConfig.itemsPerPage + '&page=' + this.paginationConfig.currentPage;
    this.loading.start();
    this.orgservice.orglist(pagelimit).subscribe((data) => {
      this.loading.stop();
      const key = 'response';
      this.orgList = data[key];
      this.paginationConfig.totalItems = data.count;
      return this.orgList;
    });
  }

  enableOrganization(id) {
    const reqObj = {
      active: true
    };
    this.orgservice.disableOrganization(id, reqObj).subscribe((data) => {
      if (data) {
        this.orgservice.isOrganizationUpdated.next(true);
        this.alertMsg = 'Selected oragnization has been enabled!'; //data.response;
        this.isOpen = true;
        this.alertType = 'success';
        this.loadOrganizationList();

      }
    }, (err) => {
      this.loading.stop();
      this.alertMsg = err;
      this.isOpen = true;
      this.alertType = 'danger';
    });
  }

  onChangeEvent(event) {
    this.paginationConfig.itemsPerPage = Number(event.target.value);
    this.paginationConfig.currentPage = 1;
    this.loadOrganizationList();
  }

  viewOrganization(orgID) {
    if (this.queryOID !== undefined && this.queryPID !== undefined) {
      this.router.navigate(['settings/organizations/details', orgID], { queryParams: { oid: this.queryOID, pid: this.queryPID }, queryParamsHandling: 'merge', skipLocationChange: false });
    }
  }

  sortNumberColumn() {
    this.ascNumberSort = !this.ascNumberSort;
    if (this.ascNumberSort) {
      this.orgList.sort((a, b) => a - b); // For ascending sort
    } else {
      this.orgList.sort((a, b) => b - a); // For descending sort
    }
  }

  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }

  ngAfterViewInit(){
    this.userService.isRevisitedQSMenuLink.subscribe((status) => { this.isRevistedLink = status.reclickqslink; this.currentLinkID = status.quickstartid; this.iswindowclicked = status.urlchanged  });
   this.showQuickStartTooltip();
   // this.userService.onClickActualBtnByUser.subscribe((status)=> this.isorgqsmenu = status);
    this.cdRef.detectChanges();
  }

  showQuickStartTooltip(){
    const a = this.quickmenuService.getQuerymenulist();

    this.quickmenuService.onClickEmitQSLinkobj.pipe(
      takeUntil(this.unsubscribeAfterUserAction$)
    ).subscribe((res) => {
      if (a.length !== 0) {
        const idx = a.findIndex((t) => t.index == 1);
        if (a[idx].quicklinks.some((t) => t.linkid == res.linkid && t.isactualbtnclicked)) {
          this.quickDivID = res.linkid;
        } else if(a[idx].quicklinks.some((t) => t.linkid == res.linkid && !t.isactualbtnclicked)) {
          this.quickDivID = res.linkid; // for revisited link
        }
      }
    });
    this.unsubscribeAfterUserAction$.next();
    this.unsubscribeAfterUserAction$.complete();
  }

  checkForQsTooltip(){
    this.quickDivID = "";
    this.userService.onRevistQuickStartmenulink.next({quickstartid:this.quickDivID,reclickqslink:true,urlchanged:true}); 
  }

  ngAfterViewChecked(){
       this.cdRef.detectChanges();
  }

  ngOnDestroy(){
    this.quickDivID = "";
    this.unsubscribeAfterUserAction$.unsubscribe();

  }

}
