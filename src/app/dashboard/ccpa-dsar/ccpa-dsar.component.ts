import { Component, OnInit, AfterViewInit } from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {
  Color,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  MultiDataSet,
  SingleDataSet
} from "ng2-charts";
import {OrganizationService} from "../../_services";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {DashboardService} from "../../_services/dashboard.service";
import {NotificationsService} from "angular2-notifications";
import {notificationConfig} from "../../_constant/notification.constant";
import * as moment from 'moment';
declare var jQuery: any;



@Component({
  selector: 'app-ccpa-dsar',
  templateUrl: './ccpa-dsar.component.html',
  styleUrls: ['./ccpa-dsar.component.scss']
})
export class CcpaDsarComponent implements OnInit, AfterViewInit {
  startDate;
  endDate;
  public lineChartData: ChartDataSets[] = [
    { data: [100], label: 'No Record'  },
  ];
  public lineChartLabels: Label[] = ['jan', 'feb', 'march'];
  public lineChartOptions: (ChartOptions & { responsive: any }) = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
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



  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['No Record'];
  public pieChartData: SingleDataSet = [100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
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


  constructor(
    private orgservice: OrganizationService,
    private loading: NgxUiLoaderService,
    private dashboardService: DashboardService,
    private notification: NotificationsService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  ngOnInit() {
    this.onGetPropsAndOrgId();
  }
  ngAfterViewInit() {
    this.onInsilizaedMap();
    this.onSetUpDate();
  }

  onInsilizaedMap() {
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
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
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
        const result = res['response'];
        if(Object.keys(result).length > 0) {
          this.dashboardCount = result['dashboardCount'];
          this.Requests = result['Requests'];
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
    // lineChartData
    if (chart['requestsChart']['data']) {
      let lineChartData = [];
      lineChartData = chart['requestsChart']['data'].map((item) => {
        return {data: item.value, label: item.label};
      });
      this.lineChartData = lineChartData;
      this.lineChartLabels = chart['requestsChart']['belowLabel'];
    }
    // doughnutChartData
    if (chart['RequestType']['data']) {
      const requestTypeLabel = [];
      const requestTypeValue = [];
      for (const data of chart['RequestType']['data']) {
        requestTypeLabel.push(data.label);
        requestTypeValue.push(data.value);
      }
      this.doughnutChartLabels = requestTypeLabel;
      this.doughnutChartData = requestTypeValue;
    }
    // pieChartData
    if (chart['subjectType']['data']) {
      const subjectTypeLabel = [];
      const subjectTypeValue = [];
      for (const data2 of chart['subjectType']['data']) {
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
        const result = res['response'];
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
