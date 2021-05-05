import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-propertydashboard',
  templateUrl: './propertydashboard.component.html',
  styleUrls: ['./propertydashboard.component.scss']
})
export class PropertydashboardComponent implements OnInit {
  propertyID: any;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.propertyID = params.get('pid');
      });
  }
}
