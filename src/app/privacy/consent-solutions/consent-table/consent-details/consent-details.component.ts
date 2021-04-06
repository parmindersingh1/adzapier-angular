import {Component, OnInit} from '@angular/core';
import {ConsentSolutionsService} from '../../../../_services/consent-solutions.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-consentlegal-table',
  templateUrl: './consent-details.component.html',
  styleUrls: ['./consent-details.component.scss']
})
export class ConsentDetailsComponent implements OnInit {
  consentData: any;
  consentPrefrenseList = [];


  constructor(private consentSolutionService: ConsentSolutionsService,
              private location: Location) {
  }

  ngOnInit() {
    this.consentSolutionService.consentSolutionDetails.subscribe(res => {
      if (res === null) {
        this.location.back();
      }
      if (Object.keys(res).length > 0) {
        this.consentData = res;
      }
      console.log('this.consent', this.consentData);
    }, error => {
      console.error(error);
    });
  }

}
