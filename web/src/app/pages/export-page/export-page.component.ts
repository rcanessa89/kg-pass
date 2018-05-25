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

    this.api.call('people/excel', 'post', body)
      .subscribe((res) => console.log(res));
  }
}
