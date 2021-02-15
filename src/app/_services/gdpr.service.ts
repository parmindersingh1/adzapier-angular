import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { GVL, TCModel, TCString } from "@iabtcf/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GdprService {
  public gvlString;
  public gvl;
  public tcModel;

  private consentInfo = new BehaviorSubject(null);
  public getConsentInfo = this.consentInfo.asObservable();
  constructor(private http: HttpClient) {
    this.gvlString = GVL.baseUrl = environment.iabUrl;
    this.gvl = new GVL();
    this.tcModel = new TCModel(this.gvl);
  }

  decodeTcString(tcString: string) {
    const decode = TCString.decode(tcString);
    return decode;
  }

  getPurposeIds(decodeData) {
    const purposeIds = [];
    for(let i = 0; decodeData.purposeConsents.maxId >= i; i++){
        if(decodeData.purposeConsents.has(i)) {
          purposeIds.push(i);
        }
    }
    return purposeIds;
  }

  getPurposeLegiIds(decodeData) {
    const purposeLegiIds = [];
    for(let i = 0; decodeData.purposeLegitimateInterests.maxId >= i; i++){
        if(decodeData.purposeLegitimateInterests.has(i)) {
          purposeLegiIds.push(i);
        }
    }
    return purposeLegiIds;
  }


  getSpecialFeatureIds(decodeData) {
    console.log('decodeData', decodeData);

    const specialFeaturesIds = [];
    for(let i = 0; decodeData.specialFeatureOptins.maxId >= i; i++){
        if(decodeData.specialFeatureOptins.has(i)) {
          specialFeaturesIds.push(i);
        }
    }
    return specialFeaturesIds;
  }



  getVendorsIds(decodeData) {
    const vendorsIds = [];
    for(let i = 0; decodeData.vendorConsents.maxId >= i; i++){
        if(decodeData.vendorConsents.has(i)) {
          vendorsIds.push(i);
        }
    }
    return vendorsIds;
  }


  getVendorsLegiIds(decodeData) {
    const vendorsLegiIds = [];
    for(let i = 0; decodeData.vendorLegitimateInterests.maxId >= i; i++){
        if(decodeData.vendorLegitimateInterests.has(i)) {
          vendorsLegiIds.push(i);
        }
    }
    return vendorsLegiIds;
  }

  getGoogleVendors(){
    return this.http.get(environment.googleVendorsUrl);
  }
  // getPurposeSpecialIds(decodeData) {
  //   const specialPurposesIds = [];
  //   console.log('decodeData', decodeData);

  //   for(let i = 0; decodeData.specialPurposes.maxId > i; i++){
  //       if(decodeData.specialPurposes.has(i)) {
  //         specialPurposesIds.push(i);
  //       }
  //   }
  //   return specialPurposesIds;
  // }

  getAllData() {
    // return this.gvl.changeLanguage(this.lang).then((res) => {
        return this.gvl.readyPromise.then(() => {
            return this.gvl;
        });
    // });
}

getIabCustomVendors() {
    return this.http.get('assets/vendors/custom-vendors.json')
}



setConsent(consent){
  console.log('consent', consent);

  this.consentInfo.next(consent);

  this.getConsentInfo.subscribe(res => {
    console.log('abc', res);

  })
}

  // onGetPurposeById(id) {
  //   return this.gvl.readyPromise.then(() => {
  //     return this.gvl.get(id);
  // });
  // }
}



// isServiceSpecific: (...)
// isServiceSpecific_: false
// lastUpdated: Fri Aug 21 2020 21:22:08 GMT+0530 (India Standard Time) {}
// numCustomPurposes: (...)
// numCustomPurposes_: 0
// policyVersion: (...)
// policyVersion_: 2
// publisherConsents: e {bitLength: 0, maxId_: 0, set_: Set(0)}
// publisherCountryCode: (...)
// publisherCountryCode_: "AA"
// publisherCustomConsents: e {bitLength: 0, maxId_: 0, set_: Set(0)}
// publisherCustomLegitimateInterests: e {bitLength: 0, maxId_: 0, set_: Set(0)}
// publisherLegitimateInterests: e {bitLength: 0, maxId_: 0, set_: Set(0)}
// publisherRestrictions: t {bitLength: 12, map: Map(0)}
// purposeConsents: e {bitLength: 24, maxId_: 10, set_: Set(10)}
// purposeLegitimateInterests: e {bitLength: 24, maxId_: 10, set_: Set(9)}
// purposeOneTreatment: (...)
// purposeOneTreatment_: false
// specialFeatureOptins: e {bitLength: 12, maxId_: 2, set_: Set(2)}
// supportOOB: (...)
// supportOOB_: true
// useNonStandardStacks: (...)
// useNonStandardStacks_: false
// vendorConsents: e {bitLength: 807, maxId_: 790, set_: Set(397)}
// vendorLegitimateInterests: e {bitLength: 807, maxId_: 790, set_: Set(178)}
// vendorListVersion: (...)
// vendorListVersion_: 47
// vendorsAllowed: e {bitLength: 0, maxId_: 0, set_: Set(0)}
// vendorsDisclosed: e {bitLength: 807, maxId_: 790, set_: Set(420)}
// version: 2
// version_: 2
