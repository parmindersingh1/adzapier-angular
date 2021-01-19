import {Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {
  Color,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  MultiDataSet,
  SingleDataSet
} from 'ng2-charts';
import {OrganizationService} from '../../_services';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {DashboardService} from '../../_services/dashboard.service';
import * as moment from 'moment';
import {moduleName} from '../../_constant/module-name.constant';

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
    borderColor: '#c40e20',
    backgroundColor: 'rgba(220, 53, 69, 0.68)',
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
    REQUEST_RECEIVED: 0
  };
  Requests = [];
  stateList: Country[] = [];
  public requestChartError = true;
  currentState = 'usa';
  private countryColor = {};
  private stateColor = {};
  public countryList = [];

  constructor(
    private orgservice: OrganizationService,
    private loading: NgxUiLoaderService,
    private cd: ChangeDetectorRef,
    private dashboardService: DashboardService,
  ) {

    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    // this.onSetUpMainMap([], [], 0);
    this.onGetPropsAndOrgId();
  }

  ngAfterViewInit() {
    this.onSetUpDate();
  }

  onCountMap(requestComplete, requestReceived, requestInProgress, timeToComplete, dashBoardChartCount) {
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
    const start = moment().subtract(29, 'days');
    const end = moment();

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
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'This Year': [moment().startOf('year'), moment().endOf('year')],
        'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
      }
    }, cb);
    cb(start, end);
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
      AVG_TIME_TO_COMPLETE: 0
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

    this.onCountMap(requestComplete, requestReceived, requestInProgress, timeToComplete, dashBoardChartCount);

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
        console.log('result', result)
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
      return this.dashboardCount.AVG_TIME_TO_COMPLETE;
    }
    return 0;
  }

  onClosed(dismissedAlert: any): void {
    this.alertMsg = !dismissedAlert;
    this.isOpen = false;
  }
}
