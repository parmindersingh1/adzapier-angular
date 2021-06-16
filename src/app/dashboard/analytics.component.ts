import { Component, OnInit } from '@angular/core';

// import { df1 } from './sampledata';
import { faChrome, faEdge, faFirefox, faSafari, faOpera } from '@fortawesome/free-brands-svg-icons';
import { UserService, AuthenticationService, OrganizationService } from 'src/app/_services';
import { DataService } from '../_services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  faChrome = faChrome;
  faEdge = faEdge;
  faFirefox = faFirefox;
  faSafari = faSafari;
  faOpera = faOpera;
  loginToken;
  currentUser: any;
  isCollapsed: any;
  isLicenseAssignedtoProperty = false;
  isLicenseAssignedtoOrganization = false;
  dsarTooltiptext:string;
  cookieTooltiptext:string;
  constructor(
    private orgservice: OrganizationService,
    private userService: UserService,
    private authService: AuthenticationService,
    private dataService: DataService
  ) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    this.isCollapsed = false;
   }
  // redirect to home if already logged in


  public barChartData = {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        data: [150, 110, 90, 115, 125, 160, 160, 140, 100, 110, 120, 120],
        backgroundColor: '#66a4fb'
      }, {
        data: [180, 140, 120, 135, 155, 170, 180, 150, 140, 150, 130, 130],
        backgroundColor: '#65e0e0'
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
        labels: {
          display: false
        }
      },
      scales: {
        xAxes: [{
          display: false,
          barPercentage: 0.5
        }],
        yAxes: [{
          gridLines: {
            color: '#ebeef3'
          },
          ticks: {
            fontColor: '#8392a5',
            fontSize: 10,
            min: 80,
            max: 200
          }
        }]
      }
    }
  };



  public chartDonut = {
    type: 'doughnut',
    data: {
      labels: ['Organic Search', 'Email', 'Referral', 'Social Media'],
      datasets: [{
        data: [20, 20, 30, 25],
        backgroundColor: ['#f77eb9', '#7ebcff', '#7ee5e5', '#fdbd88']
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  };
  public pieChartData = {
    type: 'pie',
    data: {
      labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'],
      datasets: [{
        backgroundColor: ['red', 'green', 'blue'],
        data: [350, 450, 100]
      }]
    }
  };




  public flotChart1scatterChartData = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          data: [
            { x: 61, y: 22 },
            { x: 32, y: 23 },
            { x: 31, y: 30 },
            { x: 14, y: 15 },
            { x: 52, y: 69 },
            { x: 61, y: 15 },
            { x: 32, y: 33 },
          ],

          label: 'Series B',
          fill: 'start',
          pointRadius: 0,
          backgroundColor: '#d1e6fa',
          borderColor: '#0168fa',
          borderWidth: 1.5,
        }, {
          data: [
            { x: 61, y: 15 },
            { x: 32, y: 33 },
            { x: 31, y: 60 },
            { x: 14, y: 55 },
            { x: 52, y: 99 },
            { x: 61, y: 15 },
            { x: 32, y: 33 },
          ],

          label: 'Series A',
          fill: true,
          pointRadius: 0,
          backgroundColor: '#f5f6fa',
          borderColor: '#c0ccda',
          borderWidth: 1.5,
        }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          display: false
        }]
      },
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  };


  public flotChart2scatterChartData = {
    type: 'line',
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [{
        type: 'line',
        label: 'Mobile',
        borderColor: '#66a4fb',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        data: [10, 15, 22, 26, 26, 10, 15, 22, 26, 26, 15, 22]
      }, {
        type: 'line',
        label: 'Desktop',
        data: [1, 5, 2, 6, 16, 19, 15, 0, 1, 6, 16, 19],
        pointRadius: 0,
        backgroundColor: '#f5f6fa',
        borderColor: '#c0ccda',
        borderWidth: 1.5,
        fill: false,
      }, {
        type: 'bar',
        label: 'Other',
        backgroundColor: '#e3e7ed',
        data: [5, 10, 12, 15, 18, 9, 5, 12, 13, 5, 9, 5],
        barThickness: 9,
        fill: 1
      }]

    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            display: false
          }
        }
        ],
        yAxes: [{
          display: false
        }]
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      title: {
        display: false,
        text: 'Chart.js Combo Bar Line Chart'
      },
      tooltips: {
        mode: 'index',
      },
      grid: {
        aboveData: true,
        color: '#e5e9f2',
      }
    }
  };

  public flotChart3ChartData = {
    type: 'bar',
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [{
        label: 'Mobile',
        borderColor: '#e5e9f2',
        backgroundColor: '#e5e9f2',
        barThickness: 5,
        pointRadius: 0,
        fill: false,
        data: [10, 15, 22, 26, 26, 10, 15, 22, 26, 26, 15, 22]
      }, {
        label: 'Desktop',
        data: [1, 5, 2, 6, 16, 19, 15, 0, 1, 6, 16, 19],
        pointRadius: 0,
        borderColor: '#66a4fb',
        backgroundColor: '#66a4fb',
        barThickness: 5,
        fill: false,
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          display: false, stacked: true
        }],
        yAxes: [{
          display: false, stacked: true
        }]
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      title: {
        display: false,
        text: 'Chart.js Combo Bar Line Chart'
      },
      tooltips: {
        mode: 'index',

      }
    }
  };

  public flotChart4ChartData = {
    type: 'bar',
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [{
        label: 'Mobile',
        borderColor: '#e5e9f2',
        backgroundColor: '#e5e9f2',
        borderWidth: 1.5,
        pointRadius: 0,
        barThickness: 5,
        fill: false,
        data: [10, 15, 22, 26, 26, 10, 15, 22, 26, 26, 15, 22]
      }, {
        label: 'Desktop',
        data: [1, 5, 2, 6, 16, 19, 15, 0, 1, 6, 16, 19],
        pointRadius: 0,
        borderColor: '#7ee5e5',
        backgroundColor: '#7ee5e5',
        borderWidth: 1.5,
        barThickness: 5,
        fill: false,
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          display: false, stacked: true
        }],
        yAxes: [{
          display: false, stacked: true
        }]
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      title: {
        display: false,
        text: 'Chart.js Combo Bar Line Chart'
      },
      tooltips: {
        mode: 'index',

      }
    }
  };


  public flotChart5ChartData = {
    type: 'bar',
    data: {
      labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      datasets: [{
        label: 'Mobile',
        borderColor: '#e5e9f2',
        backgroundColor: '#e5e9f2',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        data: [10, 15, 22, 26, 26, 10, 15, 22, 26, 26, 15, 22]
      }, {
        label: 'Desktop',
        data: [1, 5, 2, 6, 16, 19, 15, 0, 1, 6, 16, 19],
        pointRadius: 0,
        borderColor: '#f77eb9',
        backgroundColor: '#f77eb9',
        borderWidth: 1.5,
        fill: false,
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          display: false,
          stacked: true
        }],
        yAxes: [{
          display: false,
          stacked: true
        }]
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      title: {
        display: false,
        text: 'Chart.js Combo Bar Line Chart'
      },
      tooltips: {
        mode: 'index',

      }
    }
  };

  ngOnInit(){
   this.isPropertyLicenseAssigned();
   this.isOrganizationLicenseAssigned();
  }

  isPropertyLicenseAssigned():boolean {
    this.dataService.isLicenseAppliedForProperty.subscribe((status) =>  {
    this.isLicenseAssignedtoProperty = status.hasaccess;
    });
    this.cookieTooltiptext = this.isLicenseAssignedtoProperty ? '' : 'You have not assigned Cookie consent license to selected property';
    return this.isLicenseAssignedtoProperty;
  }

  isOrganizationLicenseAssigned():boolean {
    let licenseStatus;
    this.dataService.isLicenseApplied.subscribe((status) =>  {
     licenseStatus = status.hasaccess;
     this.isLicenseAssignedtoOrganization = licenseStatus;
     this.dsarTooltiptext = this.isLicenseAssignedtoOrganization ? '' : 'You have not assigned DSAR license to selected organization';
    });
    return this.isLicenseAssignedtoOrganization = licenseStatus;
  }

}
