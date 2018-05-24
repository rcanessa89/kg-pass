import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

// Models
import { IPerson } from '../../models/IPerson';

@Injectable({
  providedIn: 'root'
})
export class RegistriesResolverService implements Resolve<IPerson> {
  constructor(
    private api: ApiService
  ) {}

  resolve(): Observable<IPerson> {
    const url = 'people';
    const filter = {
      where: {
        check_out: null
      }
    };
    const filterJson = JSON.stringify(filter);
    const fullUrl = `${url}?filter=${filterJson}`;

    return this.api.call(fullUrl);
  }
}
