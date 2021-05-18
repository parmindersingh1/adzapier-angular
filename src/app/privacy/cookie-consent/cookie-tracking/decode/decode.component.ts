import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GdprService } from 'src/app/_services/gdpr.service';

interface RouterPayloads {
  tcstring: string;
  type: string;
}

class VendorsList {
  purposes: any;
  specialPurposes: any;
  features: any;
  specialFeatures: any;
  vendors: any;
}

class DecodedIds{
  purposeIds: any[];
  purposeLegiIds: any[];
  specialFeaturesIds: any[];
  vendorsIds: any[];
  vendorsLegiIds: any[];
}


@Component({
  selector: 'app-decode',
  templateUrl: './decode.component.html',
  styleUrls: ['./decode.component.scss']
})
export class DecodeComponent implements OnInit {
  public paramsPayloads = null;
  public decodedIds: DecodedIds = new DecodedIds();
  public purposeSpecialIds = [];
  public searchVendorsArray = [];
  public searchLegiVendorsArray = [];
  public decodeStringData = null;
  public googleVendorsList = [];
  public searchGoogleVendorsArray = [];
  public obj = null;
  public loading = {
    one: true,
    two: true,
  }
  public googleVendorsIds = [];
  vendorsList: VendorsList = new VendorsList();
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
     private gdprService: GdprService) { }

  ngOnInit() {
    this.getAllVendorsData();
    this.gdprService.getConsentInfo.subscribe(data =>{
        this.obj = data;
        if (this.obj) {
           if(Object.keys(this.obj).length > 0) {
              if (this.obj.consent_type === 'GDPR') {
                    this.decodeString();
              }
              setTimeout( () =>{
                this.loading.two = false;
              },3000)

              setTimeout( () =>{
                this.loading.one = false;
              },2000)
        }
      else {
        this.router.navigateByUrl('/cookie-consent/cookie-tracking');
      }
    }else {
        this.router.navigateByUrl('/cookie-consent/cookie-tracking');
      }
  })
  }
  onSetGoogleVendors(){
    if( this.obj.google_consent) {
      this.googleVendorsIds = this.obj.google_consent.length > 2 ? this.obj.google_consent.substring(3, this.obj.google_consent.length - 1).split('.') : [];
      this.gdprService.getGoogleVendors().subscribe((res: any[]) => {
        this.googleVendorsList = res;
      })
    }
  }

  decodeString(){
      this.onSetGoogleVendors();
      const decodeString = this.gdprService.decodeTcString(this.obj.consent);
      this.decodeStringData = decodeString;
      this.onGetTcStringData(decodeString);
  }

  async getAllVendorsData(){
    this.vendorsList = await this.gdprService.getAllData();
  }
 async onGetTcStringData(decodeString) {
    this.decodedIds.purposeIds = await this.gdprService.getPurposeIds(decodeString);
    this.decodedIds.purposeLegiIds = await this.gdprService.getPurposeLegiIds(decodeString)
    this.decodedIds.specialFeaturesIds = await this.gdprService.getSpecialFeatureIds(decodeString)
    this.decodedIds.vendorsIds = await this.gdprService.getVendorsIds(decodeString)
    this.decodedIds.vendorsLegiIds = await this.gdprService.getVendorsLegiIds(decodeString)
  }

  convertToArray(object){
   return Object.values(object)
  }

  getLength(object){
    return Object.keys(object).length;
  }
  onSearchVendors(e){
    const searchText = e.target.value;
    this.searchVendorsArray = [];
    for (const obj of Object.values(this.vendorsList.vendors)) {
      if (obj['name'].toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          this.searchVendorsArray.push(obj);
      }
  }
  }
  onSearchGoogleVendors(e) {
    const searchText = e.target.value;
    this.searchGoogleVendorsArray = [];
    for (const obj of this.googleVendorsList) {
      if (obj['provider_name'].toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          this.searchGoogleVendorsArray.push(obj);
      }
  }
  }

  onSearchLegiVendors(e){
    const searchText = e.target.value;
    this.searchLegiVendorsArray = [];
    for (const obj of Object.values(this.vendorsList.vendors)) {
      if (obj['name'].toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          this.searchLegiVendorsArray.push(obj);
      }
  }
  }

  onCalcultorLength(array){
    const ids = [];
    for(const id of array) {

      if(this.decodedIds.vendorsIds.includes(id.id)) {
      ids.push(id);
      }
    }
    return ids.length;
  }
}
