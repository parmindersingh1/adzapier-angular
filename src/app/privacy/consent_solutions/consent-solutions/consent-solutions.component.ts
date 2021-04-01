import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

export class legal_notices{
  constructor(
    public id:number,
    public consent_id:number,
    public version:number,
    public identifier:string,
    public created_at:any,
    public updated_at:any

  ){

  }
}

export class consent{
  constructor(
    public id:number,
    public owner_id:any,
    public email:any,
    public first_name:any,
    public last_name:any,
    public verified:boolean,
    public ip_address:any,
    public data_source:any,
    public LegalNotice:any,
    public Proofs:any,
    public Preference:any,
    public created_at:any,
    public updated_at:any

  ){

  }
}


@Component({
  selector: 'app-consent-solutions',
  templateUrl: './consent-solutions.component.html',
  styleUrls: ['./consent-solutions.component.scss']
})
export class ConsentSolutionsComponent implements OnInit {
  legal_notice : any;
  legal_notices=[];

  consent:any;
   consents=[];


  constructor(private httpClient:HttpClient) {
   
   }

  ngOnInit() {
    this.getlegal_notices();
    this.getConsent();

  }

  getlegal_notices(){
    this.httpClient.get<any>('https://develop-cmp-api.adzpier-staging.com/api/v1/legal_notices').subscribe(
      response =>{
        console.log(response);
        this.legal_notice=response;
      this.legal_notices = this.legal_notice.response;      }
    )
  }

  getConsent(){
    this.httpClient.get<any>('https://develop-cmp-api.adzpier-staging.com/api/v1/consent').subscribe(
      response => {
        console.log(response);
        this.consent=response;
        this.consents=this.consent.response;
      }
    )
  }
}
