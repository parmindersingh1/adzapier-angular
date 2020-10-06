import {Injectable} from '@angular/core';
import { Location } from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LokiService {
  applicationPath: string;
  constructor(private http: HttpClient) {
      this.applicationPath =  location.pathname;
  }

  onSendErrorLogs(type, msg, functionality, componentName, apiEndPoint) {
    const currentTimeStamp = 	Math.floor(new Date().getTime() / 1000.0)  + '000000000';
    const payloads = JSON.stringify({
      streams: [{
        stream: {apps: environment.lokiConfig.app, env: environment.lokiConfig.env},
        values: [[ currentTimeStamp, `Error Message level=${type} msg="${msg}" functionality=${functionality} componentName=${componentName} appEndPoint=${this.applicationPath} apiEndPoint=${apiEndPoint}`]]
      }]
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(environment.lokiUrl, payloads, httpOptions);
  }
}
