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
import {NotificationsService} from 'angular2-notifications';
import * as moment from 'moment';
import {df3} from '../sampledata';
import {moduleName} from '../../_constant/module-name.constant';

declare var jQuery: any;
interface Country {
  count: number;
  state: string;
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
  endDate;
  dismissible = true;
  alertMsg: any;
  isOpen = false;
  alertType: any;
  // public lineChartData: ChartDataSets[] = [
  //   { data: [100], label: 'No Record'  },
  // ];
  // public lineChartLabels: Label[] = ['jan', 'feb', 'march'];
  // public lineChartOptions: (ChartOptions & { responsive: any }) = {
  //   responsive: true,
  // };
  // public lineChartColors: Color[] = [
  //   {
  //     borderColor: 'black',
  //     backgroundColor: 'rgba(255,0,0,0.3)',
  //   },
  // ];
  // public lineChartLegend = true;
  // public lineChartType = 'line';
  // public lineChartPlugins = [];



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
  private countryList = [];

  constructor(
    private orgservice: OrganizationService,
    private loading: NgxUiLoaderService,
    private cd: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private notification: NotificationsService
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

  // onSetUpMainMap(data, labelData, requestsChartCount) {
  //   console.log('requestsChartCount', requestsChartCount)
  //   const newData = [{
  //     data: data[0],
  //     color: '#69b2f8'
  //   }, {
  //     data: data[1],
  //     color: '#d1e6fa'
  //   }, {
  //     data: data[2],
  //     color: '#d1e6fa',
  //     lines: {
  //       fill: false,
  //       lineWidth: 1.5
  //     }
  //   }];
  //
  //   const options = {
  //     series: {
  //       stack: 0,
  //       shadowSize: 0,
  //       lines: {
  //         show: true,
  //         lineWidth: 0,
  //         fill: 1
  //       }
  //     },
  //     grid: {
  //       borderWidth: 0,
  //       aboveData: true
  //     },
  //
  //     yaxis: {
  //       show: true,
  //       color: 'rgba(72, 94, 144, .1)',
  //       min: 0,
  //       max: requestsChartCount * 2,
  //       font: {
  //         size: 10,
  //         color: '#8392a5'
  //       }
  //     },
  //     xaxis: {
  //       show: true,
  //       ticks: labelData,
  //       // ticks: [[ 0, 'jan'], [1, 'feb'], [2, 'march'], [3, 'april'], [4 , 'may'],
  //       // [5, 'june'], [6, 'july'], [7, 'Aug'], [8, 'Sep'], [9, 'Oct'], [10, 'nov'], [11, 'dec']
  //       // ],
  //
  //       // ticks: [[0, ''], [8, 'Jan'], [20, 'Feb'], [32, 'Mar'], [44, 'Apr'], [56, 'May'],
  //       //   [68, 'Jun'], [80, 'Jul'], [92, 'Aug'], [104, 'Sep'], [116, 'Oct'], [128, 'Nov'], [140, 'Dec']],
  //       // color: 'rgba(255,255,255,.2)'
  //
  //       // ticks: [[0, ''], [2, 'Jan'], [3, 'Feb'], [4, 'Mar'], [5, 'Apr'], [6, 'May'],
  //       //   [7, 'Jun'], [8, 'Jul'], [9, 'Aug'], [10, 'Sep'], [11, 'Oct'], [12, 'Nov'], [13, 'Dec']],
  //       color: 'rgba(255,255,255,.2)'
  //     }
  //   };
  //   const plot = jQuery.plot('#requestflotChart', newData, options);
  //
  //   plot.setData(newData);
  //   plot.setupGrid();
  //   plot.draw();
  //   this.cd.detectChanges();
  //   return plot;
  // }

  onCountMap(requestComplete, requestReceived, requestInProgress, timeToComplete, dashBoardChartCount) {
    console.log('requestReceived', requestReceived);
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

    console.log('timeToComplete' , timeToComplete)
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
    console.log(
      'this.currrefdfs', this.currentState
    );
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
        colors: that.stateColor,
        selectedColor: '#00cccc',
        enableZoom: false,
        borderWidth: 1,
        borderColor: '#fff',
        hoverOpacity: .85,
        onLabelShow: (event, label, code) => {
          for (const countryData of that.stateList) {
            if (code === countryData.state.toLowerCase()) {
              label.append(' : ' + countryData.count);
            } else {
              label.append(' : 0');
            }
          }
          that.cd.detectChanges();
        }
      });
  }

  onSetWorldMap () {
    const that = this;
    jQuery('#worldMap').empty();
    jQuery('#worldMap').vectorMap({
      map: 'world_en',
      backgroundColor: '#fff',
      color: '#d1e6fa',
      colors: that.countryColor,
      hoverOpacity: 0.7,
      selectedColor: '#00cccc',
      enableZoom: true,
      showTooltip: true,
      scaleColors: ['#d1e6fa', '#00cccc'],
      normalizeFunction: 'polynomial',
      onLabelShow:  (event, label, code) => {
        for (const  countryData of that.countryList) {
          if (code === countryData.state.toLowerCase()) {
            label.append(' : ' + countryData.count);
          } else {
            label.append(' : 0');
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
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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
    const queryParam = {
      from_date: this.startDate,
      to_date: this.endDate
    };
    this.dashboardService.getCcpaAndDsar(this.currentManagedOrgID, this.currrentManagedPropID, queryParam, this.constructor.name, moduleName.ccpaDsarModule)
      .subscribe(res => {
        this.loading.stop('p1');
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
         // this.notification.info('Dashboard', 'Data not Found...', notificationConfig);
        }
      }, error => {
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
        if (chart.label === 'Recevied') {
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
      console.log('pieChartLabels', this.pieChartLabels)
      this.pieChartData = subjectTypeValue;
    }
  }

  onGetRequestByState() {
    this.loading.start();
    const queryParam = {
      from_date: this.startDate,
      to_date: this.endDate,
      country: this.currentState
    };
    this.dashboardService.getRequestByState(this.currentManagedOrgID, this.currrentManagedPropID, queryParam, this.constructor.name, moduleName.ccpaDsarModule)
      .subscribe(res => {
        this.loading.stop();
        const result = res.response;
        if (this.currentState === 'usa') {
          for (const  countryData of result) {
            this.stateColor[`${countryData.state.toLowerCase()}`] = '#69b2f8';
          }
          this.stateList = result;
          this.onSetUsaMap();
        } else {
          for (const  countryData of result) {
            this.countryColor[`${countryData.country.toLowerCase()}`] = '#69b2f8';
          }
          this.countryList = result;
          this.onSetWorldMap();
        }

      }, error => {
        this.loading.stop();
        this.isOpen = true;
        this.alertMsg = error;
        this.alertType = 'danger';
       // this.notification.error('Dashboard', 'Something went wrong...' + error, notificationConfig);
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
