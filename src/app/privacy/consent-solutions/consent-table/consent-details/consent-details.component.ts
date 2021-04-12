import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Location} from '@angular/common';
import {ConsentSolutionsService} from '../../../../_services/consent-solutions.service';

@Component({
  selector: 'app-consentlegal-table',
  templateUrl: './consent-details.component.html',
  styleUrls: ['./consent-details.component.scss'],
  encapsulation: ViewEncapsulation.None
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
