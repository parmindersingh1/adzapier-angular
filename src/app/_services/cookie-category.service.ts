import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DataSource, RequestMetadata, PagedResult, DataSort, DataFilter, NotifyService, arrayPaginate} from 'ng-mazdik-lib';
import {environment} from '../../environments/environment';
import {OrganizationService} from './index';
interface CreateCookie {
  response: [];
}
@Injectable({
  providedIn: 'root'
})
export class CookieCategoryService implements DataSource {
  primaryKeys: string[] = ['id'];
  currentManagedOrgID: any;
  currrentManagedPropID: any;
  private dataFilter: DataFilter;
  private dataSort: DataSort;

  constructor(private http: HttpClient,
              private orgservice: OrganizationService,
              private notifyService: NotifyService) {
    this.onGetPropsAndOrgId();
    this.dataFilter = new DataFilter();
    this.dataSort = new DataSort();
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

  getItems(requestMeta: RequestMetadata): Promise<PagedResult> {
    console.log('requestMeta', requestMeta);
    this.dataFilter.filters = requestMeta.filters;
    this.dataFilter.globalFilterValue = requestMeta.globalFilterValue;
    this.dataSort.sortMeta = requestMeta.sortMeta;
    const perPage = requestMeta.pageMeta.perPage;
    const currentPage = requestMeta.pageMeta.currentPage;
    const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    const params = '?limit=' + perPage + '&page' + currentPage;
    return this.http.get<PagedResult>(environment.apiUrl + path + params)
      .toPromise()
      .then( (res) => {
        if (res['status'] === 200) {
          const rows: PagedResult | any[] = res['response'] || [];
          // @ts-ignore
          const filteredData = this.dataFilter.filterRows(rows);
          const sortedData = this.dataSort.sortRows(filteredData);
          console.log('sortedData', sortedData);
          const pageData = arrayPaginate(sortedData, currentPage, perPage);
          const totalCount = sortedData.length;
          const pageCount = pageData.length;
          const result = {
            items: pageData,
            _meta: {
              totalCount,
              pageCount,
              currentPage,
              perPage
            }
          } as unknown as PagedResult;
          console.log('result', result);
          return result;
        }
      })
      .catch(this.handleError.bind(this));
  }

  getItem(row: any): Promise<any> {
    console.log('getItem', row);
    const filters = {};
    for (const key of this.primaryKeys) {
      filters[key] = {value: row[key]};
    }
    const requestMeta = {
      pageMeta: {currentPage: 1},
      filters,
    } as RequestMetadata;
    console.log('requestMeta Get', requestMeta);
    return this.getItems(requestMeta)
      .then(data => {
          return data.items[0];
        }
      );
  }

  async post(item: any): Promise<any>  {
    console.log('post', item);

    const catData = {
      category: item.category,
      description: item.description,
      duration: Number(item.duration),
      duration_type: item.duration_type,
      expiry: item.expiry,
      path: item.path,
      name: item.name,
      party: item.party,
      value: item.value
    };
    const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID;
    return this.http.post<PagedResult>(environment.apiUrl + path, catData)
      .toPromise()
      .then( (res) => {
        if (res['status'] === 201 ) {
          this.notifyService.sendMessage({title: 'Created', text: 'Record Created', severity: 'success'});
          return res['response'];
        }
      })
      .catch(this.handleError.bind(this));
  }

  put(item: any): Promise<any> {
    console.log('put', item);
    const catData = {
      category: item.category,
      description: item.description,
      duration: Number(item.duration),
      duration_type: item.duration_type,
      expiry: item.expiry,
      path: item.path,
      name: item.name,
      party: item.party,
      value: item.value
    };
    const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID + '/' + item.id;
    return this.http.put<PagedResult>(environment.apiUrl + path, catData)
      .toPromise()
      .then( (res) => {
        if (res['status'] === 200 ) {
          this.notifyService.sendMessage({title: 'Updated', text: 'Record Update', severity: 'success'});
          return res['response'];
        }
      })
      .catch(this.handleError.bind(this));
  }

  delete(item: any): Promise<any> {
    const path = '/cookie/' + this.currentManagedOrgID + '/' + this.currrentManagedPropID + '/' + item.id;
    return this.http.delete(environment.apiUrl + path)
      .toPromise()
      .then( (res) => {
        if (res['status'] === 200 ) {
          this.notifyService.sendMessage({title: 'Deleted', text: 'Record Deleted', severity: 'success'});
          return item;
        }
      })
      .catch(this.handleError.bind(this));
  }

  getOptions(url: string, parentId: any): Promise<any> {
    console.log('getOptions', parentId);
    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        const result = response.filter((value: any) => {
          return value.parentId === parentId;
        });
        return new Promise((resolve) => {
          setTimeout(() => resolve(result), 1000);
        });
      })
      .catch(this.handleError);
  }

  private handleError(error: any) {
    console.log('error', error);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: errorMessage, severity: 'error'});
    return Promise.reject(errorMessage);
  }

  createCategory(categoryData: { name: any; description: any }) {
    return this.http.post(environment.apiUrl + '/cookiecategory', categoryData);
  }

  getCategoriesList(): Promise<any> {
      return this.http.get(environment.apiUrl + '/cookiecategory')
        .toPromise()
        .then(res => {
          return res;
        })
        .catch(this.handleError.bind(this));
  }
}
