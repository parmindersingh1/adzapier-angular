import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LokiService {

  constructor(private http: HttpClient) {
  }

  onSendErrorLogs(type, msg, functionality, endPoint) {
    const currentTimeStamp = 	Math.floor(new Date().getTime() / 1000.0)  + '000000000';
    const payloads = JSON.stringify({
      streams: [{
        stream: {apps: environment.lokiConfig.app, env: environment.lokiConfig.env},
        values: [[ currentTimeStamp, `Error Message level=${type} msg="${msg}" functionality=${functionality} endPoint=${endPoint}`]]
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
