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
import {notificationConfig} from '../../_constant/notification.constant';
import * as moment from 'moment';
import {df1, df2, df3, df4, df5, df6} from '../sampledata';
import {ChangeDetection} from '@angular/cli/lib/config/schema';

declare var jQuery: any;


@Component({
  selector: 'app-ccpa-dsar',
  templateUrl: './ccpa-dsar.component.html',
  styleUrls: ['./ccpa-dsar.component.scss']
})
export class CcpaDsarComponent implements OnInit, AfterViewInit {
  startDate;
  endDate;
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


  // Doughnut
  public doughnutChartLabels: Label[] = ['No Record'];
  public doughnutChartData: MultiDataSet = [
    [100],
  ];

  public doughnutChartType: ChartType = 'doughnut';
  doughnutColors = [
    {
      backgroundColor: [
        '#f77db9',
        '#7dbcff',
        '#7de5e5',
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
        '#f77db9',
        '#7dbcff',
        '#7de5e5',
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
  stateList: [];
  public requestChartError = true;
  currentState = 'usa';

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
    this.onInsilizaedMap();
    this.onSetUpDate();
  }

  onSetUpMainMap(data, labelData, requestsChartCount) {
    console.log('mainData', data);
    const newData = [{
      //   data: df1,
      //   color: '#69b2f8'
      // }, {
      //   data: df2,
      //   color: '#d1e6fa'
      // }, {
      //   data: df3,
      //   color: '#d1e6fa',
      //   lines: {
      //     fill: false,
      //     lineWidth: 1.5
      //   }

      data: data[0],
      color: '#69b2f8'
    }, {
      data: data[1],
      color: '#d1e6fa'
    }, {
      data: data[2],
      color: '#d1e6fa',
      lines: {
        fill: false,
        lineWidth: 1.5
      }
    }];

    const options = {
      series: {
        stack: 0,
        shadowSize: 0,
        lines: {
          show: true,
          lineWidth: 0,
          fill: 1
        }
      },
      grid: {
        borderWidth: 0,
        aboveData: true
      },

      yaxis: {
        show: true,
        color: 'rgba(72, 94, 144, .1)',
        min: 0,
        max: requestsChartCount * 2,
        font: {
          size: 10,
          color: '#8392a5'
        }
      },
      xaxis: {
        show: true,
        ticks: labelData,
        // ticks: [[ 0, 'jan'], [1, 'feb'], [2, 'march'], [3, 'april'], [4 , 'may'],
        // [5, 'june'], [6, 'july'], [7, 'Aug'], [8, 'Sep'], [9, 'Oct'], [10, 'nov'], [11, 'dec']
        // ],

        // ticks: [[0, ''], [8, 'Jan'], [20, 'Feb'], [32, 'Mar'], [44, 'Apr'], [56, 'May'],
        //   [68, 'Jun'], [80, 'Jul'], [92, 'Aug'], [104, 'Sep'], [116, 'Oct'], [128, 'Nov'], [140, 'Dec']],
        // color: 'rgba(255,255,255,.2)'

        // ticks: [[0, ''], [2, 'Jan'], [3, 'Feb'], [4, 'Mar'], [5, 'Apr'], [6, 'May'],
        //   [7, 'Jun'], [8, 'Jul'], [9, 'Aug'], [10, 'Sep'], [11, 'Oct'], [12, 'Nov'], [13, 'Dec']],
        color: 'rgba(255,255,255,.2)'
      }
    };
    const plot = jQuery.plot('#requestflotChart', newData, options);

    plot.setData(newData);
    plot.setupGrid();
    plot.draw();
    this.cd.detectChanges();
    return plot;
  }

  onCountMap(requestComplete, requestReceived, requestInProgress, timeToComplete, dashBoardChartCount) {
    console.log('dashBoardChartCount', dashBoardChartCount);
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
        max: dashBoardChartCount.REQUEST_RECEIVED
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
        max: dashBoardChartCount.REQUEST_IN_PROGRESS
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
        max: dashBoardChartCount.REQUEST_COMPLETED
      },
      xaxis: {show: false}
    });

    jQuery.plot('#flotChart6', [{
      data: timeToComplete,
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
        max: dashBoardChartCount.AVG_TIME_TO_COMPLETE
      },
      xaxis: {show: false}
    });
  }

  onSelectCountry(country) {
    this.currentState = country;
    console.log(
      'this.currrefdfs', this.currentState
    )
    setTimeout(() => {
      this.onInsilizaedMap();
    }, 1000);
  }

  onInsilizaedMap() {
    if (this.currentState === 'usa') {
      console.log('in usa');
      jQuery('#vmap').vectorMap({
        map: 'usa_en',
        showTooltip: true,
        backgroundColor: '#fff',
        color: '#d1e6fa',
        colors: {
          fl: '#69b2f8',
          ca: '#69b2f8',
          tx: '#69b2f8',
          wy: '#69b2f8',
          ny: '#69b2f8'
        },
        selectedColor: '#00cccc',
        enableZoom: false,
        borderWidth: 1,
        borderColor: '#fff',
        hoverOpacity: .85,
      });
    } else {
      const sample_data = {
        'af': '16.63',
        'in': '11.58',
        'ca': '158.97',
        'us': '255.97'
      };
      jQuery('#worldMap').vectorMap({
        map: 'world_en',
        backgroundColor: '#fff',
        color: '#d1e6fa',
        hoverOpacity: 0.7,
        selectedColor: '#00cccc',
        enableZoom: true,
        showTooltip: true,
        values: sample_data,
        scaleColors: ['#d1e6fa', '#00cccc'],
        normalizeFunction: 'polynomial',

        onLabelShow: function (event, label, code) {
          let x = sample_data[code];
          console.log(event);
          console.log(label)
          console.log(code)
          if (x) {
            label[0].innerHTML = label[0].innerHTML + code + ':' + x;
          }

        }
      });
    }
    this.cd.detectChanges();
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
    this.loading.start();
    const queryParam = {
      from_date: this.startDate,
      to_date: this.endDate
    };
    this.dashboardService.getCcpaAndDsar(this.currentManagedOrgID, this.currrentManagedPropID, queryParam)
      .subscribe(res => {
        this.loading.stop();
        const result = res.response;
        if (Object.keys(result).length > 0) {
          this.dashboardCount = result.dashboardCount;
          this.Requests = result.Requests;
          this.onSetChartData(result);
        } else {
          this.notification.info('Dashboard', 'Data not Found...', notificationConfig);
        }
      }, error => {
        this.loading.stop();
        this.notification.error('Dashboard', 'Something went wrong...' + error, notificationConfig);
      });
  }

  onSetChartData(chart) {
    let requestsChartCount = 0;
    if (chart.requestsChart.data) {
      this.requestChartError = false;
      const newArray = [...chart.requestsChart.data];
      // const demo = [
      //   {label: "Recevied", value: [4,23,23,67,12,43, 12, 24, 43,6, 7,34]},
      //   {label: "Recevied", value: [32,67,88,45,12,54, 34, 90, 43,2, 87,66]},
      //   {label: "Recevied", value: [12,23,54,56,54,23, 2, 67, 2,12, 34,32]},
      //   {label: "Recevied", value: [98,78,67,67,98,42, 21, 43, 34,76, 11,4]},
      // ];
      // console.log('old', demo);
      const data = [];
      for (const chart of newArray) {
        const numVal = [];
        const value = chart.value;
        for (let i = 0; value.length > i; i++) {
          numVal.push([i, value[i]]);
          if (requestsChartCount < value[i]) {
            requestsChartCount = value[i];
          }
        }
        data.push(numVal);
      }
      const newLabel = [...chart.requestsChart.belowLabel];
      const labelData = [];
      for (let i = 0; newLabel.length > i; i++) {
        labelData.push([i, newLabel[i]]);
      }
      setTimeout(() => {
        this.onSetUpMainMap(data, labelData, requestsChartCount).draw();
      }, 1000);

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
    const queryParam = {
      from_date: this.startDate,
      to_date: this.endDate,
      country: 'USA'
    };
    this.dashboardService.getRequestByState(this.currentManagedOrgID, this.currrentManagedPropID, queryParam)
      .subscribe(res => {
        this.loading.stop();
        const result = res.response;
        this.stateList = result;
      }, error => {
        this.loading.stop();
        this.notification.error('Dashboard', 'Something went wrong...' + error, notificationConfig);
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
}
