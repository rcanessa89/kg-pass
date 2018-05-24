import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../share/confirm-dialog/confirm-dialog.component';
import { ApiService } from '../../providers/api.service';

import { IPerson } from '../../models/IPerson';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePageComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private api: ApiService
  ) {}

  public registries: IPerson[] = this.activatedRoute.snapshot.data.people;
  public confirmDialog: MatDialogRef<ConfirmDialogComponent>;

  public formatDate(date: Date): string {
    return moment(date).format('MMMM D YYYY [at] h:mma');
  }

  public showCheckoutModal(person: IPerson, index: number): void {
    this.confirmDialog = this.dialog.open(ConfirmDialogComponent);

    this.confirmDialog
      .afterClosed()
      .subscribe((confirmation: boolean) => {
        if (confirmation) {
          this.setCheckout(person, index);
        }
      });
  }

  private setCheckout(person: IPerson, index: number): void {
    const url = `people/${person.id}`;
    const body: IPerson = {
      ...person,
      check_out: new Date()
    };

    this.api.call(url, 'put', body)
      .subscribe(() => this.removeRegistry(index));
  }

  private removeRegistry(index: number): void {
    this.registries = [
      ...this.registries.slice(0, index),
      ...this.registries.slice(index + 1, this.registries.length)
    ];
  }
}
