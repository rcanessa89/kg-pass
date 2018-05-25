import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpEvent,
  HttpRequest,
  HttpClient,
  HttpEventType
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    public http: HttpClient
  ) {}

  private baseUrl = 'http://localhost:3000/api/';

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