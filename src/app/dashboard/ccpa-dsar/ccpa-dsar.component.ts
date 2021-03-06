import {Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, OnDestroy} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {
  Color,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  MultiDataSet,
  SingleDataSet
} from 'ng2-charts';
import {Location} from '@angular/common';
import {OrganizationService} from '../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {DashboardService} from '../../_services/dashboard.service';
import * as moment from 'moment';
import {moduleName} from '../../_constant/module-name.constant';
import {DataService} from '../../_services/data.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';


declare var jQuery: any;
interface Country {
  count: number;
  statecode: string;
  statename: string;
}
const colorValues =  [
  {
    borderColor: '#0168fa',
    backgroundColor: 'rgba(104, 154, 223, 0.68)',
    borderWidth: 1
  },
  {
    borderColor: '#c29200',
    backgroundColor: 'rgba(255, 193, 7, 0.68)',
    borderWidth: 1
  },
  {
    borderColor: '#5cb85c',
    backgroundColor: 'rgba(92, 184, 92, 0.68)',
    borderWidth: 1
  },
  {
    borderColor: '#f10075',
    backgroundColor: 'rgba(241, 0, 117, 1)',
    borderWidth: 1
  },
  {
    borderColor: '#6f42c1',
    backgroundColor: 'rgba(111, 66, 193, 1)',
    borderWidth: 1
  },
];

const colorCodes = [ '#f77eb9', '#fdb16d', '#c693f9',   '#65e0e0', '#69b2f8',   '#6fd39b'];
const nullStatics = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]
];
@Component({
  selector: 'app-ccpa-dsar',
  templateUrl: './ccpa-dsar.component.html',
  styleUrls: ['./ccpa-dsar.component.scss']
})
export class CcpaDsarComponent implements OnInit, AfterViewInit {
  startDate;
  requestType = [];
  subjectType = [];
  skeletonLoading = false;
  skeletonLoadingState = false;
  endDate;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;

  public lineChartData  = [
    {},
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          // suggestedMax: 10,
          // stepSize: 1
          callback: (value) => {
            if (Math.floor(value) === value) {
              return value;
            }
          }
        }
      }]
    }
  };
  public lineChartColors = [
    {
      borderColor: '#99ffff',
      backgroundColor: '#c3f6f6',
      borderWidth: 1
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
  // Doughnut
  public doughnutChartLabels: Label[] = ['No Record'];
  public doughnutChartData: MultiDataSet = [
    [100],
  ];
  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    legend: {position: 'bottom'}

  };
  public doughnutChartType: ChartType = 'doughnut';
  doughnutColors = [
    {
      backgroundColor: [
 '#f77eb9', '#fdb16d', '#c693f9',   '#65e0e0', '#69b2f8',   '#6fd39b'
      ]
    }
  ];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {position: 'bottom'}

  };
  public pieChartLabels: Label[] = ['No Record'];
  public pieChartData: SingleDataSet = [100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  pieColors = [
    {
      backgroundColor: [
        '#f77eb9', '#fdb16d', '#c693f9',   '#65e0e0', '#69b2f8',   '#6fd39b'
      ]
    }
  ];

  currentManagedOrgID: any;
  currrentManagedPropID: any;
  dashboardCount = {
    AVG_TIME_TO_COMPLETE: 0,
    REQUEST_COMPLETED: 0,
    REQUEST_IN_PROGRESS: 0,
    REQUEST_RECEIVED: 0,
    REQUEST_REJECTED: 0,
    REQUEST_DELETED: 0
  };
  Requests = [];
  stateList: Country[] = [];
  public requestChartError = true;
  currentState = 'usa';
  private countryColor = {};
  private stateColor = {};
  public countryList = [];
  isShowDashboard = false;
@ViewChild('noSup', {static: true}) noSup;
  queryOID;
  queryPID;
  modalRef: BsModalRef;
  constructor(
    private orgservice: OrganizationService,
    private modalService: BsModalService,
    private loading: NgxUiLoaderService,
    private cd: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private dataService: DataService,
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private titleService: Title 
  ) {

    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.titleService.setTitle("DSAR Dashboard - Adzapier Portal");

  }

  ngOnInit() {
    this.activatedRoute.queryParams
    .subscribe((params: any) => {
      this.queryOID = params.oid;
      this.queryPID = params.pid;
    });
    // this.onSetUpMainMap([], [], 0);
    this.onGetPropsAndOrgId();
    this.onCheckSubscription();
  }

  ngAfterViewInit() {
    this.onSetUpDate();
    this.cdRef.detectChanges();
  }


  onCheckSubscription() {
    const resData: any = this.dataService.getCurrentOrganizationPlanDetails();
    const features = resData !== "" ? resData.response.features : null;
    if (features == null) {
      this.isShowDashboard = false;
      this.dataService.isLicenseApplied.next({requesttype:'organization',hasaccess:false});
    } else {
      if( Object.keys(features).length > 0) {
        this.isShowDashboard = true;
        this.dataService.isLicenseApplied.next({requesttype:'organization',hasaccess:true});
      } else {
        this.isShowDashboard = false;
        this.dataService.isLicenseApplied.next({requesttype:'organization',hasaccess:false});
      }
    }
  //  this.onOpenPopUp();
  }

  onOpenPopUp() {
    if (!this.isShowDashboard) {
        this.modalRef = this.modalService.show(this.noSup, {class: 'modal-md', ignoreBackdropClick: true});
    }
  }


  onCountMap(requestComplete, requestReceived, requestInProgress, timeToComplete, requestRejected, requestDeleted, dashBoardChartCount) {
    jQuery.plot('#flotChart3', [{
      data: requestReceived,
      color: '#9db2c6'
    }], {
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 2,
          fill: true,
          fillColor: {colors: [{opacity: 0}, {opacity: .5}]}
        }
      },
      grid: {
        borderWidth: 0,
        labelMargin: 0
      },
      yaxis: {
        show: false,
        min: 0,
        max: dashBoardChartCount.REQUEST_RECEIVED * 2
      },
      xaxis: {show: false}
    });

    jQuery.plot('#flotChart4', [{
      data: requestInProgress,
      color: '#9db2c6'
    }], {
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 2,
          fill: true,
          fillColor: {colors: [{opacity: 0}, {opacity: .5}]}
        }
      },
      grid: {
        borderWidth: 0,
        labelMargin: 0
      },
      yaxis: {
        show: false,
        min: 0,
        max: dashBoardChartCount.REQUEST_IN_PROGRESS * 2
      },
      xaxis: {show: false}
    });

    jQuery.plot('#flotChart5', [{
      data: requestComplete,
      color: '#9db2c6'
    }], {
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 2,
          fill: true,
          fillColor: {colors: [{opacity: 0}, {opacity: .5}]}
        }
      },
      grid: {
        borderWidth: 0,
        labelMargin: 0
      },
      yaxis: {
        show: false,
        min: 0,
        max: dashBoardChartCount.REQUEST_COMPLETED * 2
      },
      xaxis: {show: false}
    });

    jQuery.plot('#flotChart6', [{
      // data: timeToComplete,
      data: timeToComplete.length > 0 ? timeToComplete : nullStatics,
      color: '#9db2c6'
    }], {
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 2,
          fill: true,
          fillColor: {colors: [{opacity: 0}, {opacity: .5}]}
        }
      },
      grid: {
        borderWidth: 0,
        labelMargin: 0
      },
      yaxis: {
        show: false,
        min: 0,
        max: dashBoardChartCount.AVG_TIME_TO_COMPLETE * 2
      },
      xaxis: {show: false}
    });

    jQuery.plot('#flotChart7', [{
      //data: timeToComplete,
      data: requestRejected,//.length > 0 ? requestRejected : nullStatics,
      color: '#9db2c6'
    }], {
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 2,
          fill: true,
          fillColor: {colors: [{opacity: 0}, {opacity: .5}]}
        }
      },
      grid: {
        borderWidth: 0,
        labelMargin: 0
      },
      yaxis: {
        show: false,
        min: 0,
        max: dashBoardChartCount.REQUEST_REJECTED * 2
      },
      xaxis: {show: false}
    });

    jQuery.plot('#flotChart8', [{
      //data: timeToComplete,
      data: requestDeleted,//.length > 0 ? requestRejected : nullStatics,
      color: '#9db2c6'
    }], {
      series: {
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 2,
          fill: true,
          fillColor: {colors: [{opacity: 0}, {opacity: .5}]}
        }
      },
      grid: {
        borderWidth: 0,
        labelMargin: 0
      },
      yaxis: {
        show: false,
        min: 0,
        max: dashBoardChartCount.REQUEST_DELETED * 2
      },
      xaxis: {show: false}
    });
  }

  onSelectCountry(e) {
    const country = e.target.value;
    this.currentState = country;
    setTimeout(() => {
      this.onGetRequestByState();
    }, 1000);
  }

  onSetUsaMap() {
    const that = this;
    jQuery('#vmap').empty();
    jQuery('#vmap').vectorMap({
      map: 'usa_en',
      showTooltip: true,
      backgroundColor: '#fff',
      color: '#d1e6fa',
      colors: that.stateList.length ? that.stateColor : null,
      selectedColor: '#00cccc',
      enableZoom: false,
      borderWidth: 1,
      borderColor: '#fff',
      hoverOpacity: .85,
      onLabelShow:  (event, label, code) => {
        for (const  stateData of that.stateList) {
          if (code === stateData.statecode.toLowerCase()) {
            label.append(' : ' + stateData.count);
          } else {
            // label.append(' : 0');
          }
        }
        that.cd.detectChanges();
      }
    });
  }

  onSetWorldMap () {
    const that = this
    jQuery('#worldMap').empty();
    jQuery('#worldMap').vectorMap({
      map: 'world_en',
      backgroundColor: '#fff',
      color: '#d1e6fa',
      colors:  that.countryList.length ? that.countryColor : null,
      hoverOpacity: 0.7,
      selectedColor: '#00cccc',
      enableZoom: true,
      showTooltip: true,
      scaleColors: ['#d1e6fa', '#00cccc'],
      normalizeFunction: 'polynomial',
      onLabelShow:  (event, label, code) => {
        for (const  countryData of that.countryList) {
          if (code === countryData.countrycode.toLowerCase()) {
            label.append(' : ' + countryData.count);
          }
        }
        that.cd.detectChanges();
      }
    });
  }

  onSetUpDate() {
    const that = this;
    const start = moment().utc().subtract(29, 'days');
    const end = moment().utc();

    // tslint:disable-next-line:no-shadowed-variable
    function cb(start, end) {
      jQuery('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      that.startDate = start.format('YYYY-MM-DD');
      that.endDate = end.format('YYYY-MM-DD');
      that.onGetCcpaAndDsar();
      that.onGetRequestByState();
    }

    jQuery('#reportrange').daterangepicker({
      startDate: start,
      endDate: end,
      maxDate: new Date(),
      ranges: {
        Today: [moment().utc(), moment().utc()],
        Yesterday: [moment().utc().subtract(1, 'days'), moment().utc().subtract(1, 'days')],
        'Last 7 Days': [moment().utc().subtract(6, 'days'), moment().utc()],
        'Last 30 Days': [moment().utc().subtract(29, 'days'), moment().utc()],
        'This Month': [moment().utc().startOf('month'), moment().utc().endOf('month')],
        'Last Month': [moment().utc().subtract(1, 'month').startOf('month'), moment().utc().subtract(1, 'month').endOf('month')],
        'This Year': [moment().utc().startOf('year'), moment().utc().endOf('year')],
        'Last Year': [moment().utc().subtract(1, 'year').startOf('year'), moment().utc().subtract(1, 'year').endOf('year')],
      }
    }, cb);
    cb(start, end);
  }

  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id || response.response.oid;
        this.currrentManagedPropID = response.property_id || response.response.id;
      } else {
        this.currentManagedOrgID = this.queryOID;
        this.currrentManagedPropID = this.queryPID;
      }
    });
  }

  onGetCcpaAndDsar() {
    this.loading.start('p1');
    this.skeletonLoading = true;
    const queryParam = {
      from_date: this.startDate,
      to_date: this.endDate
    };
    this.dashboardService.getCcpaAndDsar(this.currentManagedOrgID, this.currrentManagedPropID, queryParam, this.constructor.name, moduleName.ccpaDsarModule)
      .subscribe(res => {
        this.loading.stop('p1');
        this.skeletonLoading = false;
        const result = res.response;
        if (Object.keys(result).length > 0) {
          this.dashboardCount = result.dashboardCount;
          this.dashboardCount.REQUEST_DELETED = result.dashboardCount.REQUEST_DELETED;
          this.dashboardCount.REQUEST_REJECTED = result.dashboardCount.REQUEST_REJECTED;
          this.Requests = result.hasOwnProperty('Requests') ? result.Requests : [];
          this.requestType = result['RequestType']['data'];
          this.requestType.forEach( (element, index) => {
            return element.color = colorCodes[index];
          });
          this.subjectType = result['subjectType']['data'];
          this.subjectType.forEach( (element, index) => {
            return element.color = colorCodes[index];
          });
          this.onSetChartData(result);
        } else {
          this.isOpen = true;
          this.alertMsg = 'Data not Found...';
          this.alertType = 'info';
        }
      }, error => {
        this.skeletonLoading = false;
        this.loading.stop('p1');
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }

  onSetChartData(chart) {
    if (chart.requestsChart.data) {
      this.requestChartError = false;
      const reqChartData = [...chart.requestsChart.data];
      const reqChartLabel = [...chart.requestsChart.belowLabel];
      const data = [];
      const colorChart = [];
      for (const chart of reqChartData) {
        data.push({data:  chart.value.map(x => +x), label: chart.label});
        if (chart.label === 'Received') {
          colorChart.push(colorValues[0])
        }
        if (chart.label === 'InProgress') {
          colorChart.push(colorValues[1])
        }
        if (chart.label === 'Complete') {
          colorChart.push(colorValues[2])
        }
        if (chart.label === 'Deleted') {
          colorChart.push(colorValues[3])
        }
        if (chart.label === 'Rejected') {
          colorChart.push(colorValues[4])
        }
      }
      this.lineChartLabels = reqChartLabel;
      this.lineChartData = data;
      this.lineChartColors = colorChart;
    }

    // dashboardCount
    const dashBoardChartCount = {
      REQUEST_COMPLETED: 0,
      REQUEST_RECEIVED: 0,
      REQUEST_IN_PROGRESS: 0,
      AVG_TIME_TO_COMPLETE: 0,
      REQUEST_REJECTED: 0,
      REQUEST_DELETED: 0
    };
    const newRequestComplete = [...chart.dashboardStatistics.REQUEST_COMPLETED];
    const requestComplete = [];
    for (let i = 0; newRequestComplete.length > i; i++) {
      requestComplete.push([i, newRequestComplete[i]]);
      if (dashBoardChartCount.REQUEST_COMPLETED < newRequestComplete[i]) {
        dashBoardChartCount.REQUEST_COMPLETED = newRequestComplete[i];
      }
    }
    const newRequestReceived = [...chart.dashboardStatistics.REQUEST_RECEIVED];
    const requestReceived = [];
    for (let i = 0; newRequestReceived.length > i; i++) {
      requestReceived.push([i, newRequestReceived[i]]);
      if (dashBoardChartCount.REQUEST_RECEIVED < newRequestReceived[i]) {
        dashBoardChartCount.REQUEST_RECEIVED = newRequestReceived[i];
      }
    }
    const newRequestInProgress = [...chart.dashboardStatistics.REQUEST_IN_PROGRESS];
    const requestInProgress = [];
    for (let i = 0; newRequestInProgress.length > i; i++) {
      requestInProgress.push([i, newRequestInProgress[i]]);
      if (dashBoardChartCount.REQUEST_IN_PROGRESS < newRequestInProgress[i]) {
        dashBoardChartCount.REQUEST_IN_PROGRESS = newRequestInProgress[i];
      }
    }
    const timeToComplete = [];
    if (Array.isArray(chart.dashboardStatistics.AVG_TIME_TO_COMPLETE)) {
      const newTimeToComplete = [...chart.dashboardStatistics.AVG_TIME_TO_COMPLETE];
      for (let i = 0; newTimeToComplete.length > i; i++) {
        timeToComplete.push([i, newTimeToComplete[i]]);
        if (dashBoardChartCount.AVG_TIME_TO_COMPLETE < newTimeToComplete[i]) {
          dashBoardChartCount.AVG_TIME_TO_COMPLETE = newTimeToComplete[i];
        }
      }
    }

    const newRequestRejected = [...chart.dashboardStatistics.REQUEST_REJECTED];
    const requestRejected = [];
    for (let i = 0; newRequestRejected.length > i; i++) {
      requestRejected.push([i, newRequestRejected[i]]);
      if (dashBoardChartCount.REQUEST_REJECTED < newRequestRejected[i]) {
        dashBoardChartCount.REQUEST_REJECTED = newRequestRejected[i];
      }
    }

    const newRequestDeleted = [...chart.dashboardStatistics.REQUEST_DELETED];
    const requestDeleted = [];
    for (let i = 0; newRequestDeleted.length > i; i++) {
      requestDeleted.push([i, newRequestDeleted[i]]);
      if (dashBoardChartCount.REQUEST_DELETED < newRequestDeleted[i]) {
        dashBoardChartCount.REQUEST_DELETED = newRequestDeleted[i];
      }
    }

    this.onCountMap(requestComplete, requestReceived, requestInProgress, timeToComplete, requestRejected, requestDeleted, dashBoardChartCount);

    // doughnutChartData
    if (chart.RequestType.data) {
      const requestTypeLabel = [];
      const requestTypeValue = [];
      for (const data of chart.RequestType.data) {
        requestTypeLabel.push(data.label);
        requestTypeValue.push(data.value);
      }
      this.doughnutChartLabels = requestTypeLabel;
      this.doughnutChartData = requestTypeValue;

    }
    // this.doughnutChartLabels = ['aditya', 'amit', 'milan'];
    // this.doughnutChartData = [34, 43, 21];

    // pieChartData
    if (chart.subjectType.data) {
      const subjectTypeLabel = [];
      const subjectTypeValue = [];
      for (const data2 of chart.subjectType.data) {
        subjectTypeLabel.push(data2.label);
        subjectTypeValue.push(data2.value);
      }
      this.pieChartLabels = subjectTypeLabel;
      this.pieChartData = subjectTypeValue;
    }
  }

  onGetRequestByState() {
    this.loading.start();
    this.skeletonLoadingState = true;
    const queryParam = {
      from_date: this.startDate,
      to_date: this.endDate,
      country: this.currentState
    };
    this.dashboardService.getRequestByState(this.currentManagedOrgID, this.currrentManagedPropID, queryParam, this.constructor.name, moduleName.ccpaDsarModule)
      .subscribe(res => {
        this.loading.stop();
        this.skeletonLoadingState = false;
        const result = res.response;
        if (this.currentState === 'usa') {
          this.stateColor = {};
          for (const  countryData of result) {
            this.stateColor[`${countryData.statecode.toLowerCase()}`] = '#69b2f8';
          }
          this.stateList = result;
          this.onSetUsaMap();
        } else {
          this.countryColor = {};
          for (const  countryData of result) {
            this.countryColor[`${countryData.countrycode.toLowerCase()}`] = '#69b2f8';
          }
          this.countryList = result;
          this.onSetWorldMap();
        }
      }, error => {
        this.skeletonLoadingState = false;
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
      });
  }

  onPrint() {
    (window as any).print();
  }

  onAvgTime() {
    if (this.dashboardCount.AVG_TIME_TO_COMPLETE) {
      return this.dashboardCount.AVG_TIME_TO_COMPLETE.toFixed(2);
    }
    return 0;
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }
  onGoBack() {
    this.modalRef.hide();
    this._location.back();
  }

}


