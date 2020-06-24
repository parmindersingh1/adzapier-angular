import { Component, OnInit } from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {
  Color,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  MultiDataSet,
  SingleDataSet
} from "ng2-charts";

@Component({
  selector: 'app-ccpa-dsar',
  templateUrl: './ccpa-dsar.component.html',
  styleUrls: ['./ccpa-dsar.component.scss']
})
export class CcpaDsarComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 281, 56, 55, 40], label: 'Recevied'  },
    { data: [44, 23, 54, 23, 23, 12, 55], label: 'Completed' },
    { data: [21, 32, 54, 54, 44, 45, 43], label: 'PLAN' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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
  public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: MultiDataSet = [
    [350, 450, 100],

  ];
  public doughnutChartType: ChartType = 'doughnut';



  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  ngOnInit() {
  }


}
