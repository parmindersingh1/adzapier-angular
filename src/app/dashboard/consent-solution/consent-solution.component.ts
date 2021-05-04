import { Component, OnInit } from '@angular/core';
import {ConsentSolutionsService} from '../../_services/consent-solutions.service';
import {moduleName} from '../../_constant/module-name.constant';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-consent-solution',
  templateUrl: './consent-solution.component.html',
  styleUrls: ['./consent-solution.component.scss']
})
export class ConsentSolutionComponent implements OnInit {
  consentData: any;



  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
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
  public doughnutChartLabels: Label[] =  ['News Letter', 'Privacy Info', 'Term Of Service'];
  public doughnutChartData: number[] = [300, 500, 100];
  public doughnutChartType: ChartType = 'doughnut';
  consentColor = [             '#f77eb9', '#fdb16d',  '#65e0e0'];
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
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: this.consentColor
    },
  ];



  constructor(private consentDashboardService: ConsentSolutionsService) { }

  ngOnInit() {
    this.onGetConsentData();
  }
  onGetConsentData() {
    this.consentDashboardService.getConsentDataForDashboard(this.constructor.name, moduleName.consentSolutionModule)
      .subscribe((res: any) => {
        if (res.status === 200) {
          this.consentData = res.response;
          this.onSetUpChart();
        }
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
