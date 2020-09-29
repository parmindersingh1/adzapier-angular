import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {OrganizationService} from './index';
interface CreateCookie {
  response: [];
}
@Injectable({
  providedIn: 'root'
})
export class CookieCategoryService  {
  primaryKeys: string[] = ['id'];
  currentManagedOrgID: any;
  currrentManagedPropID: any;

  constructor(private http: HttpClient,
              private orgservice: OrganizationService) {
    this.onGetPropsAndOrgId();
  }


  onGetPropsAndOrgId() {
    this.orgservice.currentProperty.subscribe((response) => {
      if (response !== '') {
        this.currentManagedOrgID = response.organization_id;
        this.currrentManagedPropID = response.property_id;
      } else {
        const orgDetails = this.orgservice.getCurrentOrgWithProperty();
        this.currentManagedOrgID = orgDetails.organization_id;
        this.currrentManagedPropID = orgDetails.property_id;
      }
    });
  }

  getCookieData(requestMeta) {
    const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    return this.http.get(environment.apiUrl + path, { params: requestMeta});
    // let name = '';
    // let category = '';
    // if (requestMeta.filters.hasOwnProperty('name')) {
    //   name = '&name=' + requestMeta.filters.name.value;
    // }
    // if (requestMeta.filters.hasOwnProperty('category')) {
    //   category = '&categoryId=' + requestMeta.filters.category.value;
    // }
    // this.dataFilter.filters = requestMeta.filters;
    // this.dataFilter.globalFilterValue = requestMeta.globalFilterValue;
    // this.dataSort.sortMeta = requestMeta.sortMeta;
    // const perPage = requestMeta.pageMeta.perPage;
    // const currentPage = requestMeta.pageMeta.currentPage;
    // const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    // const params = '?limit=' + perPage + '&page=' + currentPage + name + category;
    // return this.http.get<PagedResult>(environment.apiUrl + path + params)
    //   .toPromise()
    //   .then( (res) => {
    //     if (res['status'] === 200) {
    //       const rows: PagedResult | any[] = res['response'] || [];
    //       // @ts-ignore
    //       const filteredData = this.dataFilter.filterRows(rows);
    //       const sortedData = this.dataSort.sortRows(filteredData);
    //       const pageData = arrayPaginate(sortedData, currentPage, perPage);
    //       const totalCount = res['count'];
    //       const pageCount = pageData.length;
    //       const result = {
    //         items: res['response'],
    //         _meta: {
    //           totalCount,
    //           pageCount,
    //           currentPage,
    //           perPage
    //         }
    //       } as unknown as PagedResult;
    //       return result;
    //     }
    //   })
    //   .catch(this.handleError.bind(this));
  }

  // getItem(row: any): Promise<any> {
  //   const filters = {};
  //   for (const key of this.primaryKeys) {
  //     filters[key] = {value: row[key]};
  //   }
  //   const requestMeta = {
  //     pageMeta: {currentPage: 1},
  //     filters,
  //   } as RequestMetadata;
  //   return this.getItems(requestMeta)
  //     .then(data => {
  //         return data.items[0];
  //       }
  //     );
  // }
  //
   post(item: any)  {
    const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    return this.http.post(environment.apiUrl + path, item);
  }
  //
  put(catData: any, id: any) {
    const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID + '/' + id;
    return this.http.put(environment.apiUrl + path, catData);
  }

  delete(item: any) {
    const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID + '/' + item.id;
    return this.http.patch(environment.apiUrl + path, {id: item.id});
  }
  //
  // getOptions(url: string, parentId: any): Promise<any> {
  //   return this.http.get(url)
  //     .toPromise()
  //     .then((response: any) => {
  //       const result = response.filter((value: any) => {
  //         return value.parentId === parentId;
  //       });
  //       return new Promise((resolve) => {
  //         setTimeout(() => resolve(result), 1000);
  //       });
  //     })
  //     .catch(this.handleError);
  // }
  //
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return Promise.reject(errorMessage);
  }

  createCategory(categoryData: { name: any; description: any }) {
    return this.http.post(environment.apiUrl + '/cookiecategory', categoryData);
  }
  //
  getCategoriesList(): Promise<any> {
      return this.http.get(environment.apiUrl + '/cookiecategory')
        .toPromise()
        .then(res => {
          return res;
        })
        .catch(this.handleError.bind(this));
  }

  cookieScanning() {
    const paramsData = {
      orgid: this.currentManagedOrgID,
      propid: this.currrentManagedPropID
    };
    return this.http.get(environment.apiUrl + '/scanner/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID);
  }
}
