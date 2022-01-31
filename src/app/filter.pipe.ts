import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(data: any, search?: string, propertyName?: string, propertyName2?: string, propertyName3?: string): any {
    if (search === undefined) {
      return data;
    } else {
      let result:any = [];
      let filteredData = data.filter(obj => obj[propertyName].toLowerCase().includes(search.toLowerCase()));
      if (propertyName2) {
        filteredData = filteredData.concat(data.filter(obj => obj[propertyName2].toLowerCase().includes(search.toLowerCase())));
        if (propertyName3) {
          filteredData = filteredData.concat(data.filter(obj => obj[propertyName3].toLowerCase().includes(search.toLowerCase())));
        }
      }
      filteredData.forEach(function(item) {
        if(result.indexOf(item) < 0) {
            result.push(item);
        }
      });

       return result;
    }
  }

}
