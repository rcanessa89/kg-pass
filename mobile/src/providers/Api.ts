import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpEvent,
  HttpRequest,
  HttpClient,
  HttpEventType
} from '@angular/common/http';

@Injectable()
export class ApiService {
  constructor(
    public http: HttpClient
  ) {

  }

  private baseUrl = 'http://10.28.6.172:3000/api/';

  public call(url: string, method: string = 'GET', body?: any): Observable<any> {
    const fullUrl = `${this.baseUrl}${url}`;
    const request = new HttpRequest(
      method.toUpperCase(),
      fullUrl,
      body
    );

    return new Observable(observer => {
      this.http.request(request)
        .subscribe((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            observer.next(event.body);
            observer.complete();
          }

        }, error => {
          observer.error(error);

          observer.complete();
        });
    });
  }
}