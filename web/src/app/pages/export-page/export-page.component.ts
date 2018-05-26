import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../providers/api.service';

@Component({
  selector: 'app-export-page',
  templateUrl: './export-page.component.html',
  styleUrls: ['./export-page.component.scss']
})
export class ExportPageComponent {
  constructor(
    private api: ApiService
  ) {}

  public from: string;
  public to: Date = new Date();

  public getExcel() {
    const url = 'people/excel';
    const body: any = {
      from: this.from,
      to: this.to
    };
    const options: any = {
      responseType: 'blob'
    }

    this.api.call('people/excel', 'post', body, options)
      .subscribe(res => {
        var url = window.URL.createObjectURL(res).split(',')[1];
        var a = document.createElement('a');

        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'registros.xlsx';

        document.body.appendChild(a);
        
        a.click();

        window.URL.revokeObjectURL(url);

        a.remove();
      });
  }
}
