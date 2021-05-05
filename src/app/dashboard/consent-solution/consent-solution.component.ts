import {Component, OnInit} from '@angular/core';
import {ConsentSolutionsService} from '../../_services/consent-solutions.service';
import {moduleName} from '../../_constant/module-name.constant';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import * as moment from 'moment';
import {NgxUiLoaderService} from 'ngx-ui-loader';

declare var jQuery: any;

@Component({
  selector: 'app-consent-solution',
  templateUrl: './consent-solution.component.html',
  styleUrls: ['./consent-solution.component.scss']
})

export class ConsentSolutionComponent implements OnInit {
  consentData: any = {
    legalNotice: 0,
    preference : {
      newsLetter: 0,
      privacyInfo: 0,
      termOfService: 0,
      totalCount: 0
    },
    proofs: 0,
    totalConsent: 0
  };

  startDate;
  endDate;

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'left'
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public doughnutChartLabels: Label[] = ['News Letter', 'Privacy Info', 'Term Of Service'];
  public doughnutChartData: number[] = [300, 500, 100];
  public doughnutChartType: ChartType = 'doughnut';
  consentColor = ['#f77eb9', '#fdb16d', '#65e0e0'];
  public doughnutChartColors = [
    {
      backgroundColor: this.consentColor
    },
  ];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Consent', 'Legal Notice', 'Proofs'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: this.consentColor
    },
  ];


  constructor(private consentDashboardService: ConsentSolutionsService,
              private loading: NgxUiLoaderService
              ) {
  }

  ngOnInit() {
    this.onSetUpDate();
    // this.onGetConsentData();
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
      that.onGetConsentData();
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


  onGetConsentData() {
    const params = {
      from_date: this.startDate,
      to_date: this.endDate
    };
    this.loading.start();
    this.consentDashboardService.getConsentDataForDashboard(this.constructor.name, params, moduleName.consentSolutionModule)
      .subscribe((res: any) => {
        this.loading.stop();
        if (res.status === 200) {
          this.consentData = res.response;
          this.onSetUpChart();
        }
      }, error => {
        this.loading.stop();
      });
  }

  onSetUpChart() {
    // preference
    const preferenceChart = this.consentData.preference;
    this.doughnutChartData = [preferenceChart.newsLetter, preferenceChart.privacyInfo, preferenceChart.termOfService];

    // Consent
    this.pieChartData = [this.consentData.totalConsent, this.consentData.legalNotice, this.consentData.proofs];
  }
}
